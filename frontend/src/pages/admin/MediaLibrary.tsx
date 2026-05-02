import React, { useCallback, useEffect, useRef, useState } from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { LoadingState, EmptyState, ErrorState } from '../../components/states';
import { useToast } from '../../components/Toast';
import {
  listMedia,
  listFolders,
  createFolder,
  deleteFolder,
  uploadMedia,
  deleteMedia,
  getMediaFullUrl,
  getMediaImageThumbnailUrl,
  type MediaFolder,
  type MediaItem,
} from '../../api/media';

function MediaThumbnail({ item, className }: { item: MediaItem; className: string }) {
  const fullUrl = getMediaFullUrl(item.url);
  const thumb = item.mimeType.startsWith('image/') ? getMediaImageThumbnailUrl(item.url) : fullUrl;
  const [src, setSrc] = useState(thumb);

  useEffect(() => {
    setSrc(item.mimeType.startsWith('image/') ? getMediaImageThumbnailUrl(item.url) : fullUrl);
  }, [item.id, item.mimeType, item.url, fullUrl]);

  if (!item.mimeType.startsWith('image/')) {
    return null;
  }

  return (
    <img
      src={src}
      alt=""
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (src !== fullUrl) setSrc(fullUrl);
      }}
    />
  );
}

const MediaLibrary = () => {
  const { showToast } = useToast();
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [folderFilter, setFolderFilter] = useState<'all' | string>('all');
  const [newFolderName, setNewFolderName] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFolders = useCallback(async () => {
    try {
      const data = await listFolders();
      setFolders(data);
    } catch {
      setFolders([]);
    }
  }, []);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listMedia(folderFilter === 'all' ? undefined : folderFilter);
      setMedia(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }, [folderFilter]);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const handleUploadClick = () => {
    setUploadError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    setUploadError(null);
    try {
      const fid = folderFilter === 'all' ? undefined : folderFilter;
      for (let i = 0; i < files.length; i++) {
        await uploadMedia(files[i], fid);
      }
      await loadMedia();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (deletingId) return;
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteMedia(id);
      setMedia((prev) => prev.filter((m) => m.id !== id));
      setCurrentIndex((idx) => {
        if (idx === null) return null;
        const item = media.findIndex((m) => m.id === id);
        if (item === -1) return idx;
        if (idx === item) return null;
        if (idx > item) return idx - 1;
        return idx;
      });
      showToast('Media deleted.', 'success');
    } catch (err) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Delete failed';
      showToast(msg, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const openAt = (index: number) => {
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setCurrentIndex(null);
    document.body.style.overflow = '';
  };

  const handleCreateFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    try {
      await createFolder(name);
      setNewFolderName('');
      await loadFolders();
      showToast('Folder created', 'success');
    } catch (err) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Could not create folder';
      showToast(msg, 'error');
    }
  };

  const handleDeleteFolder = async (folderId: string, folderName: string) => {
    if (!window.confirm(`Delete empty folder "${folderName}"?`)) return;
    try {
      await deleteFolder(folderId);
      if (folderFilter === folderId) setFolderFilter('all');
      await loadFolders();
      await loadMedia();
      showToast('Folder deleted', 'success');
    } catch (err) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Could not delete folder';
      showToast(msg, 'error');
    }
  };

  const showPrev = useCallback(() => {
    if (currentIndex === null) return;
    setCurrentIndex((idx) => (idx === null ? null : (idx - 1 + media.length) % media.length));
  }, [currentIndex, media.length]);

  const showNext = useCallback(() => {
    if (currentIndex === null) return;
    setCurrentIndex((idx) => (idx === null ? null : (idx + 1) % media.length));
  }, [currentIndex, media.length]);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (ev.key === 'Escape') closeModal();
      else if (ev.key === 'ArrowLeft') showPrev();
      else if (ev.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentIndex, showNext, showPrev]);

  const folderBtn = (active: boolean) =>
    `w-full text-left px-3 py-2 rounded-lg text-sm transition-colors border ${
      active
        ? 'bg-primary/15 border-primary/30 text-text font-medium'
        : 'border-transparent text-text-muted hover:bg-background hover:text-text'
    }`;

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 md:p-10 max-w-7xl mx-auto text-text">
          <LoadingState message="Loading media..." />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6 md:p-10 max-w-7xl mx-auto text-text">
          <ErrorState message={error} onRetry={loadMedia} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto text-text">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <aside className="w-full lg:w-60 shrink-0 rounded-xl border border-border bg-surface p-4 shadow-md lg:sticky lg:top-6">
            <h2 className="text-sm font-semibold text-text mb-3">Folders</h2>
            <button
              type="button"
              onClick={() => setFolderFilter('all')}
              className={folderBtn(folderFilter === 'all')}
            >
              All media
            </button>
            <ul className="space-y-1 mb-4 max-h-64 overflow-y-auto mt-1">
              {folders.map((f) => (
                <li key={f.id} className="flex items-center gap-1 group">
                  <button
                    type="button"
                    onClick={() => setFolderFilter(f.id)}
                    className={`${folderBtn(folderFilter === f.id)} flex-1 min-w-0`}
                    title={f.name}
                  >
                    <span className="truncate block">{f.name}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteFolder(f.id, f.name)}
                    className="opacity-0 group-hover:opacity-100 shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-error hover:bg-error/10 text-lg leading-none"
                    aria-label={`Delete folder ${f.name}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 pt-2 border-t border-border">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="New folder name"
                className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-border bg-background text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              <button
                type="button"
                onClick={handleCreateFolder}
                className="shrink-0 px-3 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:opacity-90"
              >
                Add
              </button>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-text">Media Library</h1>
                <p className="text-text-muted mt-1 text-sm">
                  Upload and organize assets. Images can use resized URLs via query params.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {uploadError && (
                  <span className="text-sm text-error" role="alert">
                    {uploadError}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleUploadClick}
                  disabled={uploading}
                  className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold hover:opacity-90 shadow-md transition-all disabled:opacity-50"
                >
                  {uploading ? 'Uploading…' : 'Upload media'}
                </button>
                <input
                  type="file"
                  accept="image/*,video/*,audio/*,.pdf"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {media.length === 0 ? (
              <EmptyState
                title="No media yet"
                message='Use "Upload media" to add images, video, audio, or PDFs.'
                actionLabel="Upload media"
                onAction={handleUploadClick}
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {media.map((item, idx) => {
                  const fullUrl = getMediaFullUrl(item.url);
                  const isImage = item.mimeType.startsWith('image/');
                  const isVideo = item.mimeType.startsWith('video/');
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-border bg-surface shadow-md overflow-hidden flex flex-col cursor-pointer group relative transition-shadow hover:shadow-lg"
                      onClick={() => openAt(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') openAt(idx);
                      }}
                      aria-label={`Open ${item.originalName}`}
                    >
                      <div className="aspect-square w-full bg-background flex items-center justify-center overflow-hidden">
                        {isImage ? (
                          <MediaThumbnail item={item} className="w-full h-full object-cover" />
                        ) : isVideo ? (
                          <video
                            src={fullUrl}
                            controls={false}
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm text-text-muted px-2 text-center">
                            PDF / file
                          </span>
                        )}
                      </div>
                      <div className="p-2 border-t border-border">
                        <p
                          className="text-xs text-text truncate text-center"
                          title={item.originalName}
                        >
                          {item.originalName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, item.id, item.originalName)}
                        disabled={deletingId === item.id}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-error text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:opacity-95 disabled:opacity-50 transition shadow-md"
                        aria-label={`Delete ${item.originalName}`}
                      >
                        {deletingId === item.id ? '…' : '×'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {currentIndex !== null && media[currentIndex] && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Media viewer"
            onClick={closeModal}
          >
            <div
              className="relative max-w-[95vw] max-h-[95vh] w-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeModal}
                className="absolute -top-1 right-0 sm:top-0 z-10 rounded-full bg-surface/90 text-text border border-border px-3 py-1.5 text-sm hover:bg-background"
                aria-label="Close viewer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={showPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-surface/90 text-text border border-border w-10 h-10 hover:bg-background hidden sm:flex items-center justify-center"
                aria-label="Previous"
              >
                ◀
              </button>

              <button
                type="button"
                onClick={showNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-surface/90 text-text border border-border w-10 h-10 hover:bg-background hidden sm:flex items-center justify-center"
                aria-label="Next"
              >
                ▶
              </button>

              <div className="flex flex-col items-center mt-8 sm:mt-0">
                {(() => {
                  const item = media[currentIndex];
                  const viewerUrl = getMediaFullUrl(item.url);
                  const isImage = item.mimeType.startsWith('image/');
                  const isVideo = item.mimeType.startsWith('video/');
                  if (isImage) {
                    return (
                      <img
                        src={viewerUrl}
                        alt={item.originalName}
                        className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-xl border border-border bg-surface"
                      />
                    );
                  }
                  if (isVideo) {
                    return (
                      <video
                        src={viewerUrl}
                        controls
                        autoPlay
                        className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-xl bg-black"
                      />
                    );
                  }
                  return (
                    <a
                      href={viewerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg bg-surface text-text px-6 py-4 rounded-lg border border-border underline hover:opacity-90"
                    >
                      Open {item.originalName}
                    </a>
                  );
                })()}

                <div className="mt-4 text-center max-w-[85vw]">
                  <div className="text-sm text-white font-medium truncate drop-shadow-md">
                    {media[currentIndex].originalName}
                  </div>
                  <div className="text-xs text-white/80 mt-1">
                    {currentIndex + 1} of {media.length}
                  </div>
                </div>

                {media.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto max-w-[85vw] pb-2 justify-center">
                    {media.map((m, i) => {
                      const stripUrl = getMediaFullUrl(m.url);
                      const thumbSrc = m.mimeType.startsWith('image/')
                        ? getMediaImageThumbnailUrl(m.url)
                        : stripUrl;
                      const img = m.mimeType.startsWith('image/');
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setCurrentIndex(i)}
                          className={`rounded-lg overflow-hidden border-2 shrink-0 ${
                            i === currentIndex
                              ? 'border-white ring-2 ring-white/50'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                          aria-label={`Show item ${i + 1}`}
                        >
                          {img ? (
                            <img
                              src={thumbSrc}
                              alt=""
                              className="h-14 w-20 object-cover"
                              onError={(e) => {
                                e.currentTarget.src = stripUrl;
                              }}
                            />
                          ) : (
                            <div className="h-14 w-20 bg-surface text-text flex items-center justify-center text-xs border border-border">
                              {m.mimeType.startsWith('video/') ? 'Video' : 'File'}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MediaLibrary;
