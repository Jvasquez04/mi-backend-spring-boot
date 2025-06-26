import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  TextField,
  MenuItem
} from '@mui/material';
import {
  Person,
  Security,
  Settings,
  Info,
  Logout
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';

const ConfiguracionPage: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Estado para configuración personalizada
  const [config, setConfig] = useState({
    appName: 'Licorería Billar',
    idioma: 'es',
    moneda: 'S/',
    logo: '',
    userImg: ''
  });

  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('configApp');
    if (saved) setConfig(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!loading && user?.rol === 'CAJERO') {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleConfigChange = (field: string, value: string) => {
    setConfig(prev => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem('configApp', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('configAppUpdate'));
      setSuccessMsg('Configuración guardada correctamente');
      setTimeout(() => setSuccessMsg(''), 2000);
      return updated;
    });
  };

  const handleImageUpload = (field: 'logo' | 'userImg', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      handleConfigChange(field, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Configuración
      </Typography>

      <Grid container spacing={3}>
        {/* Información del usuario */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Person sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">
                  Información del Usuario
                </Typography>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Nombre de Usuario"
                    secondary={user?.nombreUsuario}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Nombre Completo"
                    secondary={user?.nombreCompleto}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Rol"
                    secondary={
                      <span>
                        <Chip
                          label={user?.rol}
                          color={user?.rol === 'ADMINISTRADOR' ? 'primary' : 'default'}
                          size="small"
                        />
                      </span>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Configuración del sistema */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Settings sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                <Typography variant="h6">Personalización</Typography>
              </Box>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Nombre de la aplicación"
                  value={config.appName}
                  onChange={e => handleConfigChange('appName', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Idioma"
                  select
                  value={config.idioma}
                  onChange={e => handleConfigChange('idioma', e.target.value)}
                  fullWidth
                >
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </TextField>
                <TextField
                  label="Moneda"
                  select
                  value={config.moneda}
                  onChange={e => handleConfigChange('moneda', e.target.value)}
                  fullWidth
                >
                  <MenuItem value="S/">S/ (Sol)</MenuItem>
                  <MenuItem value="$">$ (Dólar)</MenuItem>
                  <MenuItem value="€">€ (Euro)</MenuItem>
                </TextField>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar src={config.logo} alt="Logo" sx={{ width: 56, height: 56, bgcolor: '#f5f5f5' }} />
                  <TextField
                    label="URL del logo"
                    value={config.logo}
                    onChange={e => handleConfigChange('logo', e.target.value)}
                    fullWidth
                    sx={{ flex: 1 }}
                    InputProps={{
                      endAdornment: config.logo && (
                        <Button size="small" color="error" onClick={() => handleConfigChange('logo', '')}>Quitar</Button>
                      )
                    }}
                  />
                  <Button variant="outlined" component="label" size="small">
                    Subir
                    <input type="file" accept="image/*" hidden onChange={e => {
                      if (e.target.files && e.target.files[0]) handleImageUpload('logo', e.target.files[0]);
                    }} />
                  </Button>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar src={config.userImg} alt="Usuario" sx={{ width: 56, height: 56, bgcolor: '#f5f5f5' }} />
                  <TextField
                    label="URL de imagen de usuario"
                    value={config.userImg}
                    onChange={e => handleConfigChange('userImg', e.target.value)}
                    fullWidth
                    sx={{ flex: 1 }}
                    InputProps={{
                      endAdornment: config.userImg && (
                        <Button size="small" color="error" onClick={() => handleConfigChange('userImg', '')}>Quitar</Button>
                      )
                    }}
                  />
                  <Button variant="outlined" component="label" size="small">
                    Subir
                    <input type="file" accept="image/*" hidden onChange={e => {
                      if (e.target.files && e.target.files[0]) handleImageUpload('userImg', e.target.files[0]);
                    }} />
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Acciones */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Security sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Typography variant="h6">
                  Acciones de Seguridad
                </Typography>
              </Box>
              
              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Logout />}
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Información del sistema */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Info sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Typography variant="h6">
                  Información del Sistema
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Desarrollado por:</strong> Equipo de Desarrollo
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Fecha de lanzamiento:</strong> 2024
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Tecnologías:</strong> React, TypeScript, Material-UI
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Base de datos:</strong> LocalStorage (Demo)
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary">
                Este es un sistema de demostración. Los datos se almacenan localmente en el navegador
                y se perderán al cerrar la sesión o limpiar el caché.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {successMsg && (
        <Box mt={2} textAlign="center">
          <Typography color="success.main">{successMsg}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default ConfiguracionPage; 