import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import ProductosPage from './pages/ProductosPage';
import CategoriasPage from './pages/CategoriasPage';
import VentasPage from './pages/VentasPage';
import ReportesPage from './pages/ReportesPage';
import ConfiguracionPage from './pages/ConfiguracionPage';
import AuthPage from './pages/AuthPage';
import InicioPage from './pages/InicioPage';
import Footer from './components/Footer';
import Header from './components/Header';
import BackButton from './components/BackButton';
import { CssBaseline } from '@mui/material';
import MesasPage from './pages/MesasPage';

const PrivateLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  // Mostrar BackButton en todas las subrutas de dashboard excepto en /dashboard
  const showBack = location.pathname.startsWith('/dashboard/') && location.pathname !== '/dashboard';
  return (
    <>
      <Header showBack={showBack} />
      {/* {showBack && <BackButton />} */}
      {children}
    </>
  );
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CssBaseline />
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<InicioPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <PrivateLayout>
                    <Routes>
                      <Route path="" element={<Dashboard />} />
                      <Route path="productos" element={<ProductosPage />} />
                      <Route path="categorias" element={<CategoriasPage />} />
                      <Route path="ventas" element={<VentasPage />} />
                      <Route path="reportes" element={<ReportesPage />} />
                      <Route path="configuracion" element={<ConfiguracionPage />} />
                      <Route path="mesas" element={<MesasPage />} />
                    </Routes>
                  </PrivateLayout>
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App; 