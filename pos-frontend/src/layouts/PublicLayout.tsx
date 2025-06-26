import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Licorería Billar
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" onClick={() => navigate('/')}>
              Home
            </Button>
            <Button color="inherit" onClick={() => navigate('/menu')}>
              Menú
            </Button>
            <Button color="inherit" onClick={() => navigate('/contacto')}>
              Contacto
            </Button>
            {isAuthenticated ? (
              <>
                <Button color="inherit" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button color="inherit" onClick={() => navigate('/auth')}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Outlet />
    </>
  );
};

export default PublicLayout; 