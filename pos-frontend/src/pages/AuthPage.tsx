import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { LoginData } from '../types';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({
    nombreUsuario: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const config = JSON.parse(localStorage.getItem('configApp') || '{"appName":"Sistema POS","logo":""}');

  const handleChange = (field: keyof LoginData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(formData);
      if (!success) {
        setError('Credenciales inválidas');
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={3}>
          {config.logo && (
            <Avatar src={config.logo} alt="Logo" sx={{ width: 64, height: 64, mx: 'auto', mb: 1, bgcolor: '#f5f5f5' }} />
          )}
          <Typography variant="h4" component="h1" gutterBottom>
            {config.appName || 'Sistema POS'}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Licorería Billar
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            value={formData.nombreUsuario}
            onChange={handleChange('nombreUsuario')}
            fullWidth
            margin="normal"
            required
            autoFocus
          />
          <TextField
            label="Contraseña"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !formData.nombreUsuario || !formData.password}
            sx={{ mt: 3 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AuthPage; 