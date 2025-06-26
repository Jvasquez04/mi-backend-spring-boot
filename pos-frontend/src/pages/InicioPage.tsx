import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SportsBarIcon from '@mui/icons-material/SportsBar';

const caracteristicas = [
  { icon: <ShoppingCartIcon sx={{ fontSize: 48, color: 'primary.main' }} />, text: 'Gestión de ventas y productos en tiempo real' },
  { icon: <AssessmentIcon sx={{ fontSize: 48, color: 'primary.main' }} />, text: 'Reportes automáticos y estadísticas de tu negocio' },
  { icon: <SportsBarIcon sx={{ fontSize: 48, color: 'primary.main' }} />, text: 'Control de mesas de billar y cobro por tiempo' },
];

const ventajas = [
  { icon: <StorefrontIcon color="secondary" />, title: 'Soporte dedicado', desc: 'Te acompañamos en todo momento para que tu negocio nunca se detenga.' },
  { icon: <StorefrontIcon color="secondary" />, title: 'Rápido y eficiente', desc: 'Optimiza tus ventas y operaciones con una plataforma ágil.' },
  { icon: <StorefrontIcon color="secondary" />, title: 'Seguro', desc: 'Tus datos y los de tus clientes siempre protegidos.' },
];

const InicioPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" sx={{ background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)' }}>
      {/* Cabecera */}
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <StorefrontIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            POS Licorería y Billar
          </Typography>
          <Button color="inherit" variant="outlined" onClick={() => navigate('/login')}>
            Iniciar sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* Cuerpo principal vertical y ancho, sin cards */}
      <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        {/* Bloque de bienvenida */}
        <Box textAlign="center" mb={8} width="100%">
          <StorefrontIcon sx={{ fontSize: 120, color: 'primary.main', mb: 2 }} />
          <Typography variant="h2" gutterBottom>
            Bienvenido a POS Licorería y Billar
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Sistema de Punto de Venta moderno, rápido y fácil de usar para tu negocio de licorería, billar o tienda.
          </Typography>
        </Box>
        {/* Características principales (solo 3, verticales y centradas) */}
        <Box width="100%" maxWidth={900} mb={8}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
            Características principales
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {caracteristicas.map((c, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  {c.icon}
                  <Typography variant="h6" align="center">{c.text}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
        {/* Ventajas (opcional, puedes dejarlo o quitarlo si solo quieres características) */}
      </Container>
    </Box>
  );
};

export default InicioPage; 