import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Button
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Inventory,
  Category,
  PointOfSale,
  Assessment,
  Settings
} from '@mui/icons-material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardStats } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardStats } from '../types';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import LockIcon from '@mui/icons-material/Lock';

const StatCard = ({ title, value, loading }: { title: string; value: string | number, loading: boolean }) => {
    return (
        <Card sx={{ p: 3, minWidth: 220, minHeight: 110, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', boxShadow: 3 }}>
            <Typography variant="subtitle1" color="text.secondary">{title}</Typography>
            {loading ? (
                 <Skeleton className="w-2/3 h-8 mt-1" />
            ) : (
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mt: 1 }}>{value}</Typography>
            )}
        </Card>
    );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    {
      title: 'Ventas',
      description: 'Registrar y gestionar ventas',
      icon: <PointOfSale sx={{ fontSize: 40 }} />,
      path: '/dashboard/ventas',
      color: '#f57c00'
    },
    {
      title: 'Mesas',
      description: 'Gestiona el tiempo y cobro de las mesas de billar',
      icon: <SportsBarIcon sx={{ fontSize: 40 }} />,
      path: '/dashboard/mesas',
      color: '#009688'
    },
    {
      title: 'Productos',
      description: 'Gestionar inventario y productos',
      icon: <Inventory sx={{ fontSize: 40 }} />,
      path: '/dashboard/productos',
      color: '#1976d2'
    },
    {
      title: 'Categorías',
      description: 'Administrar categorías de productos',
      icon: <Category sx={{ fontSize: 40 }} />,
      path: '/dashboard/categorias',
      color: '#388e3c'
    },
    {
      title: 'Reportes',
      description: 'Ver estadísticas y reportes',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      path: '/dashboard/reportes',
      color: '#7b1fa2'
    },
    {
      title: 'Configuración',
      description: 'Configurar el sistema',
      icon: <Settings sx={{ fontSize: 40 }} />,
      path: '/dashboard/configuracion',
      color: '#d32f2f'
    },
  ];

  // Mostrar menú solo en la ruta exacta /dashboard
  const isDashboardRoot = location.pathname === '/dashboard';

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const isCajero = user?.rol === 'CAJERO';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Aquí podrías mostrar una notificación de error al usuario
      } finally {
        setLoading(false);
      }
    };

    if (isDashboardRoot) {
      fetchStats();
    }
  }, [isDashboardRoot]);

  if (!isDashboardRoot) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Box display="flex" alignItems="center" mb={2}>
          <DashboardIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            Dashboard
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary">
          Bienvenido, {user?.nombreCompleto || user?.nombreUsuario}
        </Typography>
      </Box>

      {/* Estadísticas rápidas solo para administrador */}
      {isDashboardRoot && user?.rol === 'ADMINISTRADOR' && (
        <>
          <Grid container spacing={4} mb={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
              <StatCard title="Productos Activos" loading={loading} value={stats?.productosActivos ?? 0} />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
              <StatCard title="Ventas Hoy" loading={loading} value={stats?.ventasHoy ?? 0} />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
              <StatCard title="Ingresos Hoy" loading={loading} value={stats ? formatCurrency(stats.ingresosHoy) : 'S/ 0.00'} />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
              <StatCard title="Productos Bajos" loading={loading} value={stats?.productosBajos ?? 0} />
            </Grid>
          </Grid>
        </>
      )}

      {/* Menú principal */}
      <Typography variant="h5" gutterBottom mb={3}>
        Funciones Principales
      </Typography>
      <Grid container spacing={3}>
        {menuItems.map((item) => {
          const isEnabled = !isCajero || item.title === 'Ventas' || item.title === 'Mesas';
          return (
            <Grid item xs={12} sm={6} md={4} key={item.title}>
              <Box position="relative">
                <Card
                  sx={{
                    height: '100%',
                    cursor: isEnabled ? 'pointer' : 'not-allowed',
                    filter: isEnabled ? 'none' : 'blur(2px) grayscale(0.5)',
                    pointerEvents: isEnabled ? 'auto' : 'none',
                    transition: 'filter 0.2s',
                    opacity: isEnabled ? 1 : 0.7,
                  }}
                  onClick={isEnabled ? () => navigate(item.path) : undefined}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Box sx={{ color: item.color, mb: 2 }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
                {!isEnabled && (
                  <Box position="absolute" top={0} left={0} width="100%" height="100%" display="flex" alignItems="center" justifyContent="center" zIndex={2}>
                    <LockIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.8 }} />
                  </Box>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* Aquí se renderizan las subpáginas */}
      <Outlet />

      {/* Información adicional */}
      <Box sx={{ mt: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Información del Sistema
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sistema POS - Licorería Billar v1.0
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Usuario: {user?.nombreUsuario} | Rol: {user?.rol}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Dashboard; 