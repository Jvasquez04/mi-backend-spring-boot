import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  TextField
} from '@mui/material';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import { useAuth } from '../contexts/AuthContext';

interface MesaState {
  enUso: boolean;
  tiempoInicio: number | null;
  tiempoTranscurrido: number; // en segundos
  total: number;
  precioPorHora: number;
}

const inicializarMesa = (precio = 50): MesaState => ({
  enUso: false,
  tiempoInicio: null,
  tiempoTranscurrido: 0,
  total: 0,
  precioPorHora: precio
});

const MESAS_KEY = 'mesas';

const getMesasFromStorage = () => {
  const data = localStorage.getItem(MESAS_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return [inicializarMesa(), inicializarMesa()];
    }
  }
  return [inicializarMesa(), inicializarMesa()];
};

const MesasPage: React.FC = () => {
  const [mesas, setMesas] = useState<MesaState[]>(getMesasFromStorage());
  const { user } = useAuth();
  const isCajero = user?.rol === 'CAJERO';

  // Guardar en localStorage cada vez que cambian las mesas
  React.useEffect(() => {
    localStorage.setItem(MESAS_KEY, JSON.stringify(mesas));
  }, [mesas]);

  // Actualizar el tiempo cada segundo si alguna mesa está en uso
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMesas(prev => prev.map(mesa => {
        if (mesa.enUso && mesa.tiempoInicio) {
          const tiempoTranscurrido = Math.floor((Date.now() - mesa.tiempoInicio) / 1000);
          const horas = tiempoTranscurrido / 3600;
          return {
            ...mesa,
            tiempoTranscurrido,
            total: Math.ceil(horas * mesa.precioPorHora)
          };
        }
        return mesa;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const iniciarMesa = (idx: number) => {
    setMesas(prev => prev.map((mesa, i) =>
      i === idx ? { ...mesa, enUso: true, tiempoInicio: Date.now(), tiempoTranscurrido: 0, total: 0 } : mesa
    ));
  };

  const pararMesa = (idx: number) => {
    setMesas(prev => prev.map((mesa, i) =>
      i === idx ? { ...mesa, enUso: false, tiempoInicio: null } : mesa
    ));
  };

  const resetearMesa = (idx: number) => {
    setMesas(prev => prev.map((mesa, i) =>
      i === idx ? inicializarMesa(mesa.precioPorHora) : mesa
    ));
  };

  const cambiarPrecio = (idx: number, nuevoPrecio: number) => {
    setMesas(prev => prev.map((mesa, i) =>
      i === idx ? { ...mesa, precioPorHora: nuevoPrecio } : mesa
    ));
  };

  const formatTiempo = (segundos: number) => {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mesas de Billar
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Administra el tiempo y cobro de las mesas de billar. Inicia, detén y resetea el tiempo de cada mesa. El precio es por hora y se calcula automáticamente.
      </Typography>
      <Grid container spacing={4}>
        {mesas.map((mesa, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <SportsBarIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">Mesa {idx + 1}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Tiempo: <b>{formatTiempo(mesa.tiempoTranscurrido)}</b>
                </Typography>
                <Box display="flex" alignItems="center" gap={1} my={1}>
                  <Typography variant="body2" color="text.secondary">
                    Precio por hora:
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    value={mesa.precioPorHora}
                    onChange={e => cambiarPrecio(idx, Math.max(1, parseInt(e.target.value) || 1))}
                    inputProps={{ min: 1, style: { width: 60 } }}
                    sx={{ mx: 1 }}
                    InputProps={{ startAdornment: <span style={{ marginRight: 2 }}>S/</span> }}
                    disabled={isCajero}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Total: <b style={{ color: 'green' }}>S/ {mesa.total}</b>
                </Typography>
              </CardContent>
              <CardActions>
                {!mesa.enUso ? (
                  <Button variant="contained" color="primary" onClick={() => iniciarMesa(idx)}>
                    Iniciar
                  </Button>
                ) : (
                  <Button variant="contained" color="warning" onClick={() => pararMesa(idx)}>
                    Parar
                  </Button>
                )}
                <Button variant="outlined" color="secondary" onClick={() => resetearMesa(idx)}>
                  Resetear
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MesasPage; 