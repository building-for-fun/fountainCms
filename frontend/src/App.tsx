import Landing from './pages/public/Landing';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Documentation from './pages/public/Documentation';
import AdminPage from './pages/AdminPage';
import UsersList from './pages/admin/UsersList';
import AdminUserDetailPage from './pages/AdminUserDetailPage';
import Login from './pages/public/Login';
import { FountainThemeProvider } from './theme/ThemeProvider';
import ContentTypes from './pages/admin/ContentTypes';
import AdminEntriesPage from './pages/AdminEntriesPage';
import MediaLibrary from './pages/admin/MediaLibrary';
import AdminSettingsPage from './pages/AdminSettingsPage';
import ActivityLogs from './pages/admin/ActivityLogs';
import AdminProfilePage from './pages/AdminProfilePage';
import NotFoundError from './pages/error/NotFoundError';
import InternalServerError from './pages/error/InternalServerError';
import UnauthorizedError from './pages/error/UnauthorizedError';
import ContentEntries from './pages/admin/ContentEntries';
import Roles from './pages/admin/Roles';

export default function App() {
  return (
    <FountainThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin">
            <Route index element={<AdminPage />} />
            <Route path="users" element={<UsersList />} />
            <Route path="users/:id" element={<AdminUserDetailPage />} />
            <Route path="content-types" element={<ContentTypes />} />
            <Route path="entries" element={<AdminEntriesPage />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="roles" element={<Roles />} />
            <Route path="logs" element={<ActivityLogs />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="content/:collection" element={<ContentEntries />} />
          </Route>
          <Route path="/" element={<Landing />} />
          <Route path="/docs" element={<Documentation />} />
          {/* Error Handling Routes */}
          <Route path="/401" element={<UnauthorizedError />} />
          <Route path="/500" element={<InternalServerError />} />
          <Route path="*" element={<NotFoundError />} />
        </Routes>
      </BrowserRouter>
    </FountainThemeProvider>
  );
}
