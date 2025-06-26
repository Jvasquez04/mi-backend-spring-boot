import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer: React.FC = () => (
  <Box component="footer" sx={{
    width: '100%',
    py: 2,
    px: 2,
    mt: 'auto',
    backgroundColor: 'primary.main',
    color: 'white',
    textAlign: 'center',
    position: 'relative',
    bottom: 0
  }}>
    <Typography variant="body2">
      © {new Date().getFullYear()} POS Licorería y Billar. Todos los derechos reservados.
    </Typography>
    <Typography variant="caption">
      Desarrollado por <Link href="#" color="inherit" underline="hover">Tu Equipo</Link>
    </Typography>
  </Box>
);

export default Footer; 