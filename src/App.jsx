import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { AdminRoute } from './components/AdminRoute.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { BlogListPage } from './pages/BlogListPage.jsx';
import { WritePage } from './pages/WritePage.jsx';
import { ReadPage } from './pages/ReadPage.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { UserManagementPage } from './pages/UserManagementPage.jsx';

export function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/blogs" element={<BlogListPage />} />
            <Route path="/blogs/new" element={<WritePage />} />
            <Route path="/blogs/:id/edit" element={<WritePage />} />
            <Route path="/blog/:id" element={<ReadPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}