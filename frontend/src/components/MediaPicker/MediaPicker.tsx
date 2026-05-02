import React, { useEffect, useState } from 'react';
import {
  listMedia,
  getMediaFullUrl,
  getMediaImageThumbnailUrl,
  getMedia,
  type MediaItem,
} from '../../api/media';

interface MediaPickerProps {
  value: string | null | undefined;
  onChange: (mediaId: string | null) => void;
  disabled?: boolean;
  className?: string;
}

export function MediaPicker({ value, onChange, disabled, className = '' }: MediaPickerProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [library, setLibrary] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [loadingSelected, setLoadingSelected] = useState(false);

  useEffect(() => {
    if (!value) {
      setSelectedItem(null);
      return;
    }
    if (selectedItem?.id === value) return;
    setLoadingSelected(true);
    getMedia(value)
      .then(setSelectedItem)
      .catch(() => setSelectedItem(null))
      .finally(() => setLoadingSelected(false));
  }, [value, selectedItem?.id]);

  useEffect(() => {
    if (pickerOpen && library.length === 0) {
      setLoading(true);
      listMedia()
        .then(setLibrary)
        .catch(() => setLibrary([]))
        .finally(() => setLoading(false));
    }
  }, [pickerOpen]);

  const handleSelect = (item: MediaItem) => {
    onChange(item.id);
    setSelectedItem(item);
    setPickerOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setSelectedItem(null);
  };

  const isImage = (m: MediaItem) => m.mimeType.startsWith('image/');
  const isVideo = (m: MediaItem) => m.mimeType.startsWith('video/');

  return (
    <div className={className}>
      {loadingSelected ? (
        <div className="text-sm text-text-muted">Loading selected media…</div>
      ) : selectedItem ? (
        <div className="flex items-center gap-4 p-3 border border-border rounded-lg bg-background">
          {isImage(selectedItem) ? (
            <img
              key={selectedItem.id}
              src={getMediaImageThumbnailUrl(selectedItem.url)}
              alt=""
              className="h-14 w-14 object-cover rounded bg-background"
              onError={(e) => {
                e.currentTarget.src = getMediaFullUrl(selectedItem.url);
              }}
            />
          ) : isVideo(selectedItem) ? (
            <video
              src={getMediaFullUrl(selectedItem.url)}
              className="h-14 w-14 object-cover rounded"
              muted
            />
          ) : (
            <div className="h-14 w-14 rounded bg-background border border-border flex items-center justify-center text-text-muted text-xs">
              File
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text truncate">{selectedItem.originalName}</p>
            <p className="text-xs text-text-muted">{selectedItem.mimeType}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              disabled={disabled}
              className="px-3 py-1.5 text-sm border border-border rounded-lg text-text hover:bg-background disabled:opacity-50"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="px-3 py-1.5 text-sm border border-border rounded-lg text-error hover:bg-error/10 disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          disabled={disabled}
          className="w-full px-4 py-3 border border-border rounded-lg text-left text-text-muted hover:border-primary hover:text-text transition-all disabled:opacity-50"
        >
          Select from media library…
        </button>
      )}

      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-label="Select media"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="bg-surface border border-border rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-semibold text-text">Select media</h3>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="p-2 rounded-lg hover:bg-background text-text-muted"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {loading ? (
                <p className="text-text-muted">Loading media…</p>
              ) : library.length === 0 ? (
                <p className="text-text-muted">
                  No media in library. Upload files from Media Library.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {library.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="flex flex-col items-center p-2 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      {isImage(item) ? (
                        <img
                          src={getMediaImageThumbnailUrl(item.url)}
                          alt=""
                          className="h-20 w-full object-cover rounded mb-1 bg-background"
                          onError={(e) => {
                            e.currentTarget.src = getMediaFullUrl(item.url);
                          }}
                        />
                      ) : isVideo(item) ? (
                        <video
                          src={getMediaFullUrl(item.url)}
                          className="h-20 w-full object-cover rounded mb-1"
                          muted
                        />
                      ) : (
                        <div className="h-20 w-full rounded mb-1 bg-background border border-border flex items-center justify-center text-text-muted text-xs">
                          File
                        </div>
                      )}
                      <span className="text-xs text-text truncate w-full">{item.originalName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
