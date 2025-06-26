import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActionArea, Box } from '@mui/material';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={4} columns={12}>
        {/* Ventas */}
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <Card>
            <CardActionArea onClick={() => navigate('/ventas')}>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                  <PointOfSaleIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">Ventas</Typography>
                  <Typography variant="body2" color="text.secondary">Realiza y gestiona ventas</Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        {/* Mesas */}
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <Card>
            <CardActionArea onClick={() => navigate('/mesas')}>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                  <SportsBarIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">Mesas</Typography>
                  <Typography variant="body2" color="text.secondary">Controla el tiempo y cobro de mesas</Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        {/* Gestión de productos */}
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <Card>
            <CardActionArea onClick={() => navigate('/productos')}>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                  <InventoryIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">Gestión de productos</Typography>
                  <Typography variant="body2" color="text.secondary">Agrega, edita y elimina productos</Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        {/* Categorías */}
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <Card>
            <CardActionArea onClick={() => navigate('/categorias')}>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                  <CategoryIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">Categorías</Typography>
                  <Typography variant="body2" color="text.secondary">Gestiona las categorías de productos</Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        {/* Reportes */}
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <Card>
            <CardActionArea onClick={() => navigate('/reportes')}>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                  <AssessmentIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">Reportes</Typography>
                  <Typography variant="body2" color="text.secondary">Visualiza reportes de ventas y productos</Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        {/* Configuración */}
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
          <Card>
            <CardActionArea onClick={() => navigate('/configuracion')}>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                  <SettingsIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">Configuración</Typography>
                  <Typography variant="body2" color="text.secondary">Ajusta la configuración del sistema</Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage; 