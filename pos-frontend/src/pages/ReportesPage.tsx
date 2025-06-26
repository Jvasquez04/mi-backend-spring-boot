import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { 
  TrendingUp, 
  ShoppingCart, 
  AttachMoney, 
  Warning,
  Download
} from '@mui/icons-material';
import { DashboardStats, Venta, Categoria, Producto } from '../types';
import { getCategorias } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { getToken } from '../utils/auth';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DownloadIcon = Download;

const ReportesPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [categoriaDesplegada, setCategoriaDesplegada] = useState<number | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [ventaDetalle, setVentaDetalle] = useState<Venta | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('ReportesPage renderizando - authLoading:', authLoading, 'user:', user);

  useEffect(() => {
    console.log('ReportesPage useEffect ejecutándose');
    if (!authLoading && user?.rol === 'CAJERO') {
      console.log('Redirigiendo CAJERO al dashboard');
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    console.log('Cargando datos iniciales');
    fetchCategorias();
    fetchVentasAll();
  }, []);

  useEffect(() => {
    const refrescar = () => {
      console.log('Evento ventaRealizada recibido');
      fetchCategorias();
      fetchVentasAll();
    };
    window.addEventListener('ventaRealizada', refrescar);
    return () => window.removeEventListener('ventaRealizada', refrescar);
  }, []);

  const fetchCategorias = async () => {
    try {
      console.log('Fetching categorías...');
      const token = getToken();
      if (!token) {
        console.log('No hay token, estableciendo loading=false');
        setLoading(false);
        return;
      }
      const data = await getCategorias(token);
      console.log('Categorías cargadas:', data);
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      console.log('Estableciendo loading=false');
      setLoading(false);
    }
  };

  const fetchVentasAll = () => {
    try {
      console.log('Fetching ventas desde localStorage...');
      const ventasLocal = JSON.parse(localStorage.getItem('ventas') || '[]');
      console.log('Ventas cargadas desde localStorage:', ventasLocal);
      setVentas(ventasLocal);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      setVentas([]);
    }
  };

  const ventasPorDia = ventas.filter(v => {
    if (!fechaInicio) return true; // Si no hay filtro, mostrar todas
    const fechaVenta = new Date(v.fecha);
    return (
      fechaVenta.toLocaleDateString('es-PE') === fechaInicio.toLocaleDateString('es-PE')
    );
  });

  console.log('Filtro de fecha:', fechaInicio);
  console.log('Ventas filtradas por día:', ventasPorDia);
  console.log('Estado del componente - loading:', loading, 'authLoading:', authLoading, 'user:', user);

  const formatCurrency = (value: number) => {
    return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Si es una fecha local ya formateada, la devolvemos tal como está
        return dateString;
      }
      return date.toLocaleString('es-PE');
    } catch (error) {
      // Si hay error al parsear, devolvemos la fecha original
      return dateString;
    }
  };

  const ventasFiltradas = ventas.filter(v => {
    const fechaVenta = new Date(v.fecha);
    if (fechaInicio && fechaVenta.toLocaleDateString('es-PE') < fechaInicio.toLocaleDateString('es-PE')) return false;
    if (fechaFin && fechaVenta.toLocaleDateString('es-PE') > fechaFin.toLocaleDateString('es-PE')) return false;
    return true;
  });

  // Función para generar y descargar CSV
  const descargarVentasCSV = () => {
    const encabezado = 'ID Venta,Fecha,Producto,Cantidad,Precio Unitario,Total Venta\n';
    let filas = '';
    ventasPorDia.forEach(venta => {
      // Agrupar productos por nombre y contar cantidad
      const productosAgrupados: { [nombre: string]: { cantidad: number, precio: number } } = {};
      (venta.productosVendidos || []).forEach(vp => {
        const prod = vp.producto;
        const cantidad = vp.cantidad;
        if (!productosAgrupados[prod.nombre]) {
          productosAgrupados[prod.nombre] = { cantidad: cantidad, precio: prod.precioVenta };
        } else {
          productosAgrupados[prod.nombre].cantidad += cantidad;
        }
      });
      Object.entries(productosAgrupados).forEach(([nombre, info]) => {
        filas += `${venta.id},${formatDate(venta.fecha)},"${nombre}",${info.cantidad},${info.precio},${venta.total}\n`;
      });
    });
    const csv = encabezado + filas;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventas_${fechaInicio ? fechaInicio.toLocaleDateString('es-PE') : 'hoy'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  console.log('Antes del return - authLoading:', authLoading, 'loading:', loading);

  if (authLoading) {
    console.log('Retornando LoadingSpinner por authLoading');
    return <LoadingSpinner />;
  }
  
  // Si el usuario es CAJERO, redirigir al dashboard
  if (user?.rol === 'CAJERO') {
    console.log('Redirigiendo CAJERO al dashboard desde return');
    navigate('/dashboard');
    return <LoadingSpinner />;
  }

  console.log('Renderizando componente principal');

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reportes y Estadísticas
      </Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="outlined" color="error" onClick={() => {
          if (window.confirm('¿Estás seguro de que quieres eliminar todos los reportes? Esta acción no se puede deshacer.')) {
            localStorage.removeItem('ventas');
            setVentas([]);
            window.dispatchEvent(new Event('ventaRealizada'));
          }
        }}>
          Eliminar reportes
        </Button>
      </Box>

      {loading && <LoadingSpinner />}

      {/* Filtro de fecha arriba */}
      <Box mb={3}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DatePicker
            label="Fecha de ventas"
            value={fechaInicio}
            onChange={setFechaInicio}
            format="dd/MM/yyyy"
            slotProps={{ textField: { size: 'small' } }}
          />
        </LocalizationProvider>
        {fechaInicio && (
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => setFechaInicio(null)}
            sx={{ ml: 2 }}
          >
            Mostrar todas las ventas
          </Button>
        )}
      </Box>

      {/* Estadísticas principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {ventas.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Productos Activos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ShoppingCart sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {ventasPorDia.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ventas Hoy
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AttachMoney sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {ventasPorDia.length > 0 ? formatCurrency(ventasPorDia.reduce((sum, v) => sum + v.total, 0)) : '$0.00'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ingresos Hoy
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Warning sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {ventas.length - ventasPorDia.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Productos Bajos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Ventas del día seleccionado o de hoy */}
      <Typography variant="h5" gutterBottom>
        {fechaInicio ? `Ventas del ${fechaInicio.toLocaleDateString('es-PE')}` : 'Todas las ventas'}
      </Typography>
      {ventasPorDia.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay ventas registradas {fechaInicio ? 'en esta fecha' : 'en el sistema'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Las ventas realizadas {fechaInicio ? 'en esta fecha' : 'aparecerán aquí cuando se registren'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Total de ventas en localStorage: {ventas.length}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Venta</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Productos (detalle)</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventasPorDia.map((venta) => {
                // Agrupar productos por nombre y contar cantidad
                const productosAgrupados: { [nombre: string]: { cantidad: number, precio: number } } = {};
                (venta.productosVendidos || []).forEach(vp => {
                  const prod = vp.producto;
                  const cantidad = vp.cantidad;
                  if (!productosAgrupados[prod.nombre]) {
                    productosAgrupados[prod.nombre] = { cantidad: cantidad, precio: prod.precioVenta };
                  } else {
                    productosAgrupados[prod.nombre].cantidad += cantidad;
                  }
                });
                return (
                  <TableRow key={venta.id}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        #{venta.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(venta.fecha)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'pre-line', fontSize: 13, py: 1 }}>
                      {(venta.productosVendidos || []).map((vp, idx) => (
                        <span key={idx} style={{ display: 'block', marginBottom: 2 }}>
                          {vp.producto.nombre} x{vp.cantidad || 1} (S/ {vp.producto.precioVenta.toFixed(2)} c/u)
                        </span>
                      ))}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight="bold" color="primary">
                        {formatCurrency(venta.total)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button variant="outlined" size="small" onClick={() => setVentaDetalle(venta)}>
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Resumen del día */}
      {ventasPorDia.length > 0 && (
        <Box mt={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen del Día
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total de ventas: <strong>{ventasPorDia.length}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Ingresos totales: <strong>{formatCurrency(ventasPorDia.reduce((sum, v) => sum + v.total, 0))}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Promedio por venta: <strong>{formatCurrency(ventasPorDia.reduce((sum, v) => sum + v.total, 0) / ventasPorDia.length)}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Productos vendidos: <strong>{ventasPorDia.reduce((sum, v) => sum + (v.productosVendidos || []).length, 0)}</strong>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* DESGLOSE POR CATEGORÍA */}
      <Box mb={4} mt={4}>
        <Typography variant="h5" sx={{ mb: 2 }}>Desglose por categoría</Typography>
        <Grid container spacing={2}>
          {categorias.map(cat => {
            let productosVendidos: { nombre: string; cantidad: number; ingresos: number }[] = [];
            (ventasPorDia || []).forEach(venta => {
              (venta.productosVendidos || []).forEach(vp => {
                const prod = vp.producto;
                if (prod.categoriaId === cat.id) {
                  const idx = productosVendidos.findIndex(pv => pv.nombre === prod.nombre);
                  if (idx >= 0) {
                    productosVendidos[idx].cantidad++;
                    productosVendidos[idx].ingresos += prod.precioVenta;
                  } else {
                    productosVendidos.push({ nombre: prod.nombre, cantidad: 1, ingresos: prod.precioVenta });
                  }
                }
              });
            });
            if (productosVendidos.length === 0) return null;
            return (
              <Grid item xs={12} sm={6} md={4} key={cat.id}>
                <Button
                  fullWidth
                  variant={categoriaDesplegada === cat.id ? 'contained' : 'outlined'}
                  onClick={() => setCategoriaDesplegada(categoriaDesplegada === cat.id ? null : cat.id)}
                  sx={{ mb: 1 }}
                >
                  {cat.nombre}
                </Button>
                <Collapse in={categoriaDesplegada === cat.id}>
                  <List>
                    {(productosVendidos || []).map((prod, idx) => (
                      <ListItem key={idx} divider>
                        <ListItemText
                          primary={prod.nombre}
                          secondary={`Cantidad: ${prod.cantidad} | Ingresos: S/ ${prod.ingresos.toFixed(2)}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* RESUMEN DEL DÍA O RANGO */}
      <Box mt={4}>
        <Typography variant="h5" sx={{ mb: 2 }}>Resumen del periodo seleccionado</Typography>
        <Typography variant="body1">
          Total de productos vendidos: {(ventasFiltradas || []).reduce((sum, v) => sum + (v.productosVendidos || []).length, 0)}
        </Typography>
        <Typography variant="body1">
          Total de ingresos: S/ {(ventasFiltradas || []).reduce((sum, v) => sum + v.total, 0).toFixed(2)}
        </Typography>
      </Box>

      {/* Modal de detalle de venta */}
      <Dialog open={!!ventaDetalle} onClose={() => setVentaDetalle(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalle de Venta #{ventaDetalle?.id}</DialogTitle>
        <DialogContent dividers>
          {ventaDetalle && (
            <>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Fecha y hora: {formatDate(ventaDetalle.fecha)}
              </Typography>
              <List>
                {(ventaDetalle.productosVendidos || []).map((vp, idx) => (
                  <ListItem key={idx} divider>
                    <ListItemText
                      primary={`${vp.producto.nombre} x${vp.cantidad || 1}`}
                      secondary={`S/ ${vp.producto.precioVenta.toFixed(2)} c/u`}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      Subtotal: S/ {((vp.producto.precioVenta) * (vp.cantidad || 1)).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Box mt={2}>
                <Typography variant="h6" align="right">
                  Total: {formatCurrency(ventaDetalle.total)}
                </Typography>
              </Box>
              {/* Si existe método de pago */}
              {ventaDetalle && typeof (ventaDetalle as any).metodoPago !== 'undefined' && (ventaDetalle as any).metodoPago && (
                <Box mt={1}>
                  <Typography variant="body2" color="text.secondary">
                    Método de pago: <strong>{(ventaDetalle as any).metodoPago}</strong>
                  </Typography>
                </Box>
              )}
              {ventaDetalle && typeof ventaDetalle.recibido !== 'undefined' && (
                <Box mt={1}>
                  <Typography variant="body2" color="text.secondary">
                    Monto recibido: <strong>S/ {ventaDetalle.recibido?.toFixed(2)}</strong>
                  </Typography>
                </Box>
              )}
              {ventaDetalle && typeof ventaDetalle.vuelto !== 'undefined' && (
                <Box mt={1}>
                  <Typography variant="body2" color="text.secondary">
                    Vuelto entregado: <strong>S/ {ventaDetalle.vuelto?.toFixed(2)}</strong>
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVentaDetalle(null)} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReportesPage; 