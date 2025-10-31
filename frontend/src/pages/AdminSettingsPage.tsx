import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/Layouts/AdminLayout';
import { useFountainTheme } from '../theme/ThemeProvider';

const defaultSettings = {
  title: 'My Awesome Website',
  description: 'A modern headless CMS',
  theme: 'light',
  logoUrl: '',
};

const AdminSettingsPage = () => {
  const { mode, setMode } = useFountainTheme();
  const [settings, setSettings] = useState({ ...defaultSettings, theme: mode });
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  // Sync settings.theme with provider mode
  useEffect(() => {
    setSettings((prev) => ({ ...prev, theme: mode }));
  }, [mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
    setEditing(true);
    setSaved(false);
    // Do not call setMode here
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send settings to the backend
    setMode(settings.theme as 'light' | 'dark');
    setSaved(true);
    setEditing(false);
  };

  const handleCancel = () => {
    setSettings({ ...defaultSettings, theme: mode });
    setEditing(false);
    setSaved(false);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-8">
        <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-2xl p-10 border border-blue-100">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">
            Website Settings
          </h1>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Website Title</label>
              <input
                type="text"
                name="title"
                value={settings.title}
                onChange={handleChange}
                className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={settings.description}
                onChange={handleChange}
                className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Theme</label>
              <select
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Logo URL</label>
              <input
                type="url"
                name="logoUrl"
                value={settings.logoUrl}
                onChange={handleChange}
                className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
                placeholder="https://example.com/logo.png"
              />
              {settings.logoUrl && (
                <div className="flex flex-col items-center mt-4">
                  <span className="text-xs text-gray-500 mb-1">Logo Preview</span>
                  <img
                    src={settings.logoUrl}
                    alt="Logo Preview"
                    className="h-20 w-auto rounded-lg shadow border border-blue-100 bg-white p-2"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-8 mt-6 justify-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!editing}
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCancel}
                disabled={!editing}
              >
                Cancel
              </button>
            </div>
            {saved && (
              <div className="text-green-600 text-center font-medium mt-2 animate-pulse">
                Settings saved!
              </div>
            )}
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
