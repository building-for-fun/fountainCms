import LandingPage from './pages/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Documentation from './pages/Documenation';
import AdminPage from './pages/AdminPage';
import AdminUserListPage from './pages/AdminUserListPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/users" element={<AdminUserListPage />} />
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
