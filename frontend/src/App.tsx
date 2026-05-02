import Landing from './pages/public/Landing';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import Documentation from './pages/public/Documentation';
import UsersList from './pages/admin/UsersList';
import Login from './pages/public/Login';
import { FountainThemeProvider } from './theme/ThemeProvider';
import { ToastProvider } from './components/Toast';
import DataModels from './pages/admin/DataModels';
import MediaLibrary from './pages/admin/MediaLibrary';
import AuditLogs from './pages/admin/AuditLogs';
import NotFoundError from './pages/error/NotFoundError';
import InternalServerError from './pages/error/InternalServerError';
import UnauthorizedError from './pages/error/UnauthorizedError';
import ContentEntries from './pages/admin/ContentEntries';
import ContentEntryDetail from './pages/admin/ContentEntryDetail';
import Roles from './pages/admin/Roles';
import RequireAuth from './components/RequireAuth';
import Settings from './pages/admin/Settings';
import { Navigate } from 'react-router-dom';
import ProfilePage from './pages/admin/ProfilePage';
import Home from './pages/admin/Home';
import UserDetails from './pages/admin/UserDetails';
import ApiTokens from './pages/admin/ApiTokens';
import Webhooks from './pages/admin/Webhooks';

export default function App() {
  return (
    <FountainThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <RequireAuth requiredRole="Super Admin">
                  <Outlet />
                </RequireAuth>
              }
            >
              <Route index element={<Home />} />
              <Route path="users" element={<UsersList />} />
              <Route path="users/:id" element={<UserDetails />} />
              <Route path="data" element={<DataModels />} />
              <Route path="content-types" element={<Navigate to="/admin/data" replace />} />
              <Route path="entries" element={<Navigate to="/admin/data" replace />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="settings" element={<Settings />} />
              <Route path="roles" element={<Roles />} />
              <Route path="api-tokens" element={<ApiTokens />} />
              <Route path="webhooks" element={<Webhooks />} />
              <Route path="logs" element={<AuditLogs />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="content/:collection" element={<ContentEntries />} />
              <Route path="content/:collection/new" element={<ContentEntryDetail />} />
              <Route path="content/:collection/:id" element={<ContentEntryDetail />} />
            </Route>
            <Route path="/" element={<Landing />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/401" element={<UnauthorizedError />} />
            <Route path="/500" element={<InternalServerError />} />
            <Route path="*" element={<NotFoundError />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </FountainThemeProvider>
  );
}
