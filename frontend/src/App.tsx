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
        <Route path="/admin">
          <Route index element={<AdminPage />} />
          <Route path="users" element={<AdminUserListPage />} />
          <Route path="content-types" element={<AdminContentTypesPage />} />
          <Route path="entries" element={<AdminEntriesPage />} />
          <Route path="media" element={<AdminMediaPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="roles" element={<AdminRolesPage />} />
          <Route path="logs" element={<AdminLogsPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs" element={<Documentation />} />
        {/* Add more non-admin routes here */}
      </Routes>
    </BrowserRouter>
  );
}
