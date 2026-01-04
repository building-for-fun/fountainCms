import Landing from './pages/public/Landing';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Documentation from './pages/public/Documentation';
import AdminPage from './pages/AdminPage';
import AdminUserListPage from './pages/AdminUserListPage';
import AdminUserDetailPage from './pages/AdminUserDetailPage';
import Login from './pages/public/Login';
import { FountainThemeProvider } from './theme/ThemeProvider';
import AdminContentTypesPage from './pages/AdminContentTypesPage';
import AdminEntriesPage from './pages/AdminEntriesPage';
import MediaLibrary from './pages/admin/MediaLibrary';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminRolesPage from './pages/AdminRolesPage';
import ActivityLogs from './pages/admin/ActivityLogs';
import AdminProfilePage from './pages/AdminProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import InternalServerErrorPage from './pages/InternalServerErrorPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

export default function App() {
  return (
    <FountainThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin">
            <Route index element={<AdminPage />} />
            <Route path="users" element={<AdminUserListPage />} />
            <Route path="users/:id" element={<AdminUserDetailPage />} />
            <Route path="content-types" element={<AdminContentTypesPage />} />
            <Route path="entries" element={<AdminEntriesPage />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="roles" element={<AdminRolesPage />} />
            <Route path="logs" element={<ActivityLogs />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Route>
          <Route path="/" element={<Landing />} />
          <Route path="/docs" element={<Documentation />} />
          {/* Error Handling Routes */}
          <Route path="/401" element={<UnauthorizedPage />} />
          <Route path="/500" element={<InternalServerErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </FountainThemeProvider>
  );
}
