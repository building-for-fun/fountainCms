import React, { useCallback, useEffect, useRef, useState } from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { LoadingState, EmptyState, ErrorState } from '../../components/states';
import {
  listMedia,
  uploadMedia,
  deleteMedia,
  getMediaFullUrl,
  type MediaItem,
} from '../../api/media';

const MediaLibrary = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listMedia();
      setMedia(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }, []);

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
      for (let i = 0; i < files.length; i++) {
        await uploadMedia(files[i]);
      }
      await loadMedia();
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (deletingId) return;
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
    } catch {
      // could set delete error state
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

  const showPrev = useCallback(() => {
    if (currentIndex === null) return;
    setCurrentIndex((idx) => (idx === null ? null : (idx - 1 + media.length) % media.length));
  }, [currentIndex, media.length]);

  const showNext = useCallback(() => {
    if (currentIndex === null) return;
    setCurrentIndex((idx) => (idx === null ? null : (idx + 1) % media.length));
  }, [currentIndex, media.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === 'Escape') closeModal();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentIndex, showNext, showPrev]);

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: '24px 32px' }}>
          <LoadingState message="Loading media..." />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div style={{ padding: '24px 32px' }}>
          <ErrorState message={error} onRetry={loadMedia} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen" style={{ padding: '24px 32px', margin: '0 auto' }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-blue-700">Media Library</h1>
          <div className="flex items-center gap-3">
            {uploadError && (
              <span className="text-sm text-red-600" role="alert">
                {uploadError}
              </span>
            )}
            <button
              onClick={handleUploadClick}
              disabled={uploading}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : 'Upload Media'}
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
            message="Click “Upload Media” to add images, video, or PDFs."
            actionLabel="Upload Media"
            onAction={handleUploadClick}
          />
        ) : (
          <div className="flex flex-wrap items-start gap-4">
            {media.map((item, idx) => {
              const fullUrl = getMediaFullUrl(item.url);
              const isImage = item.mimeType.startsWith('image/');
              const isVideo = item.mimeType.startsWith('video/');
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md p-2 flex flex-col items-center border border-blue-100 max-w-[300px] w-full cursor-pointer group relative"
                  onClick={() => openAt(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') openAt(idx);
                  }}
                  aria-label={`Open ${item.originalName} in viewer`}
                >
                  {isImage ? (
                    <img
                      src={fullUrl}
                      alt={item.originalName}
                      className="h-24 w-full max-w-[300px] object-cover rounded-lg mb-1 shadow"
                    />
                  ) : isVideo ? (
                    <video
                      src={fullUrl}
                      controls={false}
                      className="h-24 w-full max-w-[300px] object-cover rounded-lg mb-1 shadow"
                    />
                  ) : (
                    <div className="h-24 w-full max-w-[300px] rounded-lg mb-1 shadow bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                      PDF / File
                    </div>
                  )}
                  <div
                    className="text-xs text-gray-700 truncate w-full text-center"
                    title={item.originalName}
                  >
                    {item.originalName}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, item.id)}
                    disabled={deletingId === item.id}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 disabled:opacity-50 transition"
                    aria-label={`Delete ${item.originalName}`}
                  >
                    {deletingId === item.id ? '…' : '×'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {currentIndex !== null && media[currentIndex] && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
            role="dialog"
            aria-modal="true"
            aria-label="Media viewer"
            onClick={closeModal}
          >
            <div
              className="relative max-w-[95vw] max-h-[95vh] w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-40 rounded-full p-2 hover:bg-opacity-60 z-10"
                aria-label="Close viewer"
              >
                ✕
              </button>

              <button
                onClick={showPrev}
                className="absolute left-2 sm:left-6 text-white bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-60 z-10"
                aria-label="Previous media"
              >
                ◀
              </button>

              <button
                onClick={showNext}
                className="absolute right-2 sm:right-6 text-white bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-60 z-10"
                aria-label="Next media"
              >
                ▶
              </button>

              <div className="flex flex-col items-center">
                {(() => {
                  const item = media[currentIndex];
                  const fullUrl = getMediaFullUrl(item.url);
                  const isImage = item.mimeType.startsWith('image/');
                  const isVideo = item.mimeType.startsWith('video/');
                  if (isImage) {
                    return (
                      <img
                        src={fullUrl}
                        alt={item.originalName}
                        className="max-h-[80vh] max-w-[80vw] object-contain rounded-md shadow-lg"
                      />
                    );
                  }
                  if (isVideo) {
                    return (
                      <video
                        src={fullUrl}
                        controls
                        autoPlay
                        className="max-h-[80vh] max-w-[80vw] object-contain rounded-md shadow-lg bg-black"
                      />
                    );
                  }
                  return (
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline"
                    >
                      Open {item.originalName}
                    </a>
                  );
                })()}

                <div className="mt-3 text-sm text-white/90 text-center px-2">
                  <div className="truncate max-w-[80vw]">{media[currentIndex].originalName}</div>
                  <div className="text-xs text-white/60">
                    {currentIndex + 1} of {media.length}
                  </div>
                </div>

                {media.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto max-w-[80vw] px-2">
                    {media.map((m, i) => {
                      const url = getMediaFullUrl(m.url);
                      const img = m.mimeType.startsWith('image/');
                      return (
                        <button
                          key={m.id}
                          onClick={() => setCurrentIndex(i)}
                          className={`rounded border-2 p-0 ${i === currentIndex ? 'border-white' : 'border-transparent'}`}
                          aria-label={`Jump to media ${i + 1}`}
                        >
                          {img ? (
                            <img
                              src={url}
                              alt={m.originalName}
                              className="h-12 w-20 object-cover rounded"
                            />
                          ) : (
                            <div className="h-12 w-20 bg-black text-white flex items-center justify-center rounded text-xs">
                              {m.mimeType.startsWith('video/') ? 'Vid' : 'File'}
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
