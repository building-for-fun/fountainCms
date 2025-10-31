import React, { useRef, useState } from 'react';
import AdminLayout from '../components/Layouts/AdminLayout';

interface MediaFile {
  url: string;
  type: string;
  name: string;
}

const AdminMediaPage = () => {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <AdminLayout>
      <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
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
          <div className="grid justify-center grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
            {media.map((file, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md p-2 flex flex-col items-center border border-blue-100 max-w-[300px] w-full"
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
                    controls
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
      </div>
    </AdminLayout>
  );
};

export default AdminMediaPage;
