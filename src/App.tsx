import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

import { seedDatabase } from './data/seed.js';
import { ToastProvider } from './context/ToastContext';
import { StorageRefreshProvider } from './context/StorageRefreshContext';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PublicStatusPage } from './pages/PublicStatusPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    seedDatabase();
  }, []);

  return (
    <ToastProvider>
      <StorageRefreshProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/status" element={<PublicStatusPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </StorageRefreshProvider>
    </ToastProvider>
  );
}

export default App;