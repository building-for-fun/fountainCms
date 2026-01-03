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
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl bg-white/95 rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Settings</h1>
          <p className="text-sm text-gray-500 mb-6">Manage global configuration for your website</p>

          <form onSubmit={handleSave} className="space-y-6">
            {/* ===== General Section ===== */}
            <div className="border-b pb-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800">General</h2>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">Website Title</label>
              <input
                type="text"
                name="title"
                value={settings.title}
                onChange={handleChange}
                className="w-full border border-blue-200 rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={settings.description}
                onChange={handleChange}
                className="w-full border border-blue-200 rounded-lg px-4 py-2"
                rows={3}
              />
            </div>

            {/* ===== Appearance Section ===== */}
            <div className="border-b pt-8 pb-4">
              <h2 className="text-lg font-semibold text-gray-800">Appearance</h2>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">Theme</label>
              <select
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="w-full border border-blue-200 rounded-lg px-4 py-2"
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
                className="w-full border border-blue-200 rounded-lg px-4 py-2"
                placeholder="https://example.com/logo.png"
              />
              {settings.logoUrl && (
                <div className="flex flex-col items-center mt-4">
                  <span className="text-xs text-gray-500 mb-1">Logo Preview</span>
                  <img
                    src={settings.logoUrl}
                    alt="Logo Preview"
                    className="h-20 w-auto rounded-lg shadow border bg-white p-2"
                  />
                </div>
              )}
            </div>

            {/* ===== Actions ===== */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                disabled={!editing}
                className="px-6 py-2 rounded-lg border text-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!editing}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>

            {saved && <div className="text-green-600 text-center font-medium">Settings saved!</div>}
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
