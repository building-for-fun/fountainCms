import LandingPage from './pages/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Documentation from './pages/Documenation';
import AdminPage from './pages/AdminPage';
import AdminUserListPage from './pages/AdminUserListPage';
import LoginPage from './pages/LoginPage';
import AdminContentTypesPage from './pages/AdminContentTypesPage';
import AdminEntriesPage from './pages/AdminEntriesPage';
import AdminMediaPage from './pages/AdminMediaPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminRolesPage from './pages/AdminRolesPage';
import AdminLogsPage from './pages/AdminLogsPage';
import AdminProfilePage from './pages/AdminProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/users" element={<AdminUserListPage />} />
        <Route path="/admin/content-types" element={<AdminContentTypesPage />} />
        <Route path="/admin/entries" element={<AdminEntriesPage />} />
        <Route path="/admin/media" element={<AdminMediaPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/roles" element={<AdminRolesPage />} />
        <Route path="/admin/logs" element={<AdminLogsPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
        <Route
          path="*"
          element={
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/docs" element={<Documentation />} />
              {/* Add more non-admin routes here */}
            </Routes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
