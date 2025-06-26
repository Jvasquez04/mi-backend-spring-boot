import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Avatar } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useAuth } from '../contexts/AuthContext';
import BackButton from './BackButton';

interface HeaderProps {
  showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showBack }) => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="sticky" color="primary" elevation={2} sx={{ zIndex: 1201 }}>
      <Toolbar>
        {showBack && <BackButton />}
        <StorefrontIcon sx={{ mx: 1, fontSize: 32 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          POS Licorería y Billar
        </Typography>
        {user && (
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user.nombreCompleto?.charAt(0) || user.nombreUsuario.charAt(0)}
            </Avatar>
            <Box textAlign="right">
              <Typography variant="body2" fontWeight="bold">
                {user.nombreCompleto || user.nombreUsuario}
              </Typography>
              <Typography variant="caption" color="#fff9">
                {user.rol}
              </Typography>
            </Box>
            <Button color="inherit" variant="outlined" size="small" onClick={logout} sx={{ ml: 2 }}>
              Cerrar sesión
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 