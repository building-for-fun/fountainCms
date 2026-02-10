import React, { useCallback, useEffect, useRef, useState } from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';

interface MediaFile {
  url: string;
  type: string;
  name: string;
}

const MediaLibrary = () => {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newMedia: MediaFile[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newMedia.push({ url, type: file.type, name: file.name });
    });
    setMedia((prev) => [...newMedia, ...prev]);
    e.target.value = '';
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
    setCurrentIndex((idx) => {
      if (idx === null) return null;
      return (idx - 1 + media.length) % media.length;
    });
  }, [currentIndex, media.length]);

  const showNext = useCallback(() => {
    if (currentIndex === null) return;
    setCurrentIndex((idx) => {
      if (idx === null) return null;
      return (idx + 1) % media.length;
    });
  }, [currentIndex, media.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      } else if (e.key === 'ArrowRight') {
        showNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentIndex, showNext, showPrev]);

  useEffect(() => {
    return () => {
      media.forEach((m) => {
        try {
          URL.revokeObjectURL(m.url);
        } catch (e) {
          // ignore
        }
      });
    };
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen " style={{ padding: '24px 32px', margin: '0 auto' }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-blue-700">Media Library</h1>
          <button
            onClick={handleUploadClick}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            Upload Media
          </button>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        {media.length === 0 ? (
          <div className="text-gray-500 text-center mt-20">
            No media uploaded yet. Click "Upload Media" to add images or videos.
          </div>
        ) : (
          <div className="flex flex-wrap items-start gap-4">
            {media.map((file, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md p-2 flex flex-col items-center border border-blue-100 max-w-[300px] w-full cursor-pointer"
                onClick={() => openAt(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') openAt(idx);
                }}
                aria-label={`Open media ${file.name} in viewer`}
              >
                {file.type.startsWith('image') ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="h-24 w-full max-w-[300px] object-cover rounded-lg mb-1 shadow"
                  />
                ) : file.type.startsWith('video') ? (
                  <video
                    src={file.url}
                    controls={false}
                    className="h-24 w-full max-w-[300px] object-cover rounded-lg mb-1 shadow"
                  />
                ) : null}
                <div
                  className="text-xs text-gray-700 truncate w-full text-center"
                  title={file.name}
                >
                  {file.name}
                </div>
              </div>
            ))}
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
                className="absolute top-4 right-4 text-white bg-black bg-opacity-40 rounded-full p-2 hover:bg-opacity-60"
                aria-label="Close viewer"
              >
                ✕
              </button>

              <button
                onClick={showPrev}
                className="absolute left-2 sm:left-6 text-white bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-60"
                aria-label="Previous media"
              >
                ◀
              </button>

              <button
                onClick={showNext}
                className="absolute right-2 sm:right-6 text-white bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-60"
                aria-label="Next media"
              >
                ▶
              </button>

              <div className="flex flex-col items-center">
                {media[currentIndex].type.startsWith('image') ? (
                  <img
                    src={media[currentIndex].url}
                    alt={media[currentIndex].name}
                    className="max-h-[80vh] max-w-[80vw] object-contain rounded-md shadow-lg"
                  />
                ) : media[currentIndex].type.startsWith('video') ? (
                  <video
                    src={media[currentIndex].url}
                    controls
                    autoPlay
                    className="max-h-[80vh] max-w-[80vw] object-contain rounded-md shadow-lg bg-black"
                  />
                ) : null}

                <div className="mt-3 text-sm text-white/90 text-center px-2">
                  <div className="truncate max-w-[80vw]">{media[currentIndex].name}</div>
                  <div className="text-xs text-white/60">{`${currentIndex + 1} of ${media.length}`}</div>
                </div>

                {media.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto max-w-[80vw] px-2">
                    {media.map((m, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`rounded border-2 p-0 ${i === currentIndex ? 'border-white' : 'border-transparent'}`}
                        aria-label={`Jump to media ${i + 1}`}
                      >
                        {m.type.startsWith('image') ? (
                          <img
                            src={m.url}
                            alt={m.name}
                            className="h-12 w-20 object-cover rounded"
                          />
                        ) : (
                          <div className="h-12 w-20 bg-black text-white flex items-center justify-center rounded">
                            Vid
                          </div>
                        )}
                      </button>
                    ))}
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
