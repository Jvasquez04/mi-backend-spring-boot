import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  Button,
  Box,
  Snackbar,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  TextField,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment
} from '@mui/material';
import { ShoppingCart, Add, Remove, Delete, Clear, Print } from '@mui/icons-material';
import { Producto, Venta, Categoria } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Imágenes de ejemplo para bebidas
const imagenesBebidas: Record<string, string> = {
  'Ron Barceló': 'https://www.licoresmedellin.com/cdn/shop/products/ron-barcelo-anejo-700ml.jpg?v=1677692782',
  'Cerveza Corona': 'https://www.latiendadelcervecero.com/cdn/shop/products/Corona355ml.png?v=1614359782',
  'Tequila Don Julio': 'https://cdn.shopify.com/s/files/1/0257/6089/3921/products/tequila-don-julio-reposado-750ml.png?v=1642521072',
  'Whisky Johnnie Walker': 'https://www.licoresmedellin.com/cdn/shop/products/whisky-johnnie-walker-red-label-700ml.jpg?v=1677692782',
  'Vodka Smirnoff': 'https://www.latiendadelcervecero.com/cdn/shop/products/Smirnoff700ml.png?v=1614359782',
};

interface CarritoItem {
  producto: Producto;
  cantidad: number;
}

const QR_YAPE = 'https://play-lh.googleusercontent.com/1Qw1kQnQw1kQnQw1kQnQw1kQnQw1kQnQw1kQnQw1kQnQw1kQnQw1kQ=w600-h600'; // Imagen QR de ejemplo

const VentasPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });
  const [modalPago, setModalPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'yape'>('efectivo');
  const [recibido, setRecibido] = useState('');
  const [vuelto, setVuelto] = useState(0);
  const [search, setSearch] = useState('');
  const [ventaReciente, setVentaReciente] = useState<Venta | null>(null);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = () => {
    setLoading(true);
    const productosLocal = JSON.parse(localStorage.getItem('productos') || '[]');
    setProductos(productosLocal);
    setLoading(false);
  };

  const fetchCategorias = () => {
    const categoriasLocal = JSON.parse(localStorage.getItem('categorias') || '[]');
    setCategorias(categoriasLocal);
  };

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito(prev => {
      const idx = prev.findIndex(item => item.producto.id === producto.id);
      if (idx >= 0) {
        // Si ya está, aumenta la cantidad
        const nuevo = [...prev];
        if (nuevo[idx].cantidad < producto.stockActual) {
          nuevo[idx].cantidad += 1;
        }
        return nuevo;
      } else {
        return [...prev, { producto, cantidad: 1 }];
      }
    });
  };

  const quitarDelCarrito = (productoId: number) => {
    setCarrito(prev => prev.filter(item => item.producto.id !== productoId));
  };

  const cambiarCantidad = (productoId: number, cantidad: number) => {
    setCarrito(prev => prev.map(item =>
      item.producto.id === productoId
        ? { ...item, cantidad: Math.max(1, Math.min(cantidad, item.producto.stockActual)) }
        : item
    ));
  };

  const limpiarCarrito = () => setCarrito([]);

  const calcularTotal = () => carrito.reduce((sum, item) => sum + item.producto.precioVenta * item.cantidad, 0);

  useEffect(() => {
    if (metodoPago === 'efectivo') {
      const rec = parseFloat(recibido);
      setVuelto(rec > 0 ? rec - calcularTotal() : 0);
    } else {
      setVuelto(0);
    }
  }, [recibido, metodoPago, carrito]);

  const finalizarVenta = async () => {
    if (carrito.length === 0) return;
    try {
      setSaving(true);
      const nuevaVenta: Venta = {
        id: Date.now(),
        fecha: new Date().toLocaleDateString('es-PE') + ' ' + new Date().toLocaleTimeString('es-PE'),
        productosVendidos: carrito.map(item => ({ producto: item.producto, cantidad: item.cantidad })),
        total: calcularTotal(),
        metodoPago,
        recibido: parseFloat(recibido) || 0,
        vuelto: vuelto || 0
      };
      // Guardar en localStorage
      const ventasLocal = JSON.parse(localStorage.getItem('ventas') || '[]');
      ventasLocal.push(nuevaVenta);
      localStorage.setItem('ventas', JSON.stringify(ventasLocal));
      console.log('Venta guardada en localStorage:', nuevaVenta);
      console.log('Total de ventas en localStorage:', ventasLocal.length);
      setVentaReciente(nuevaVenta);
      showSnackbar('Venta realizada exitosamente', 'success');
      // Actualizar stock localmente
      setProductos(prevProductos => {
        const actualizados = prevProductos.map(prod => {
          const vendido = carrito.find(item => item.producto.id === prod.id);
          if (vendido) {
            return { ...prod, stockActual: Math.max((prod.stockActual || 0) - vendido.cantidad, 0) };
          }
          return prod;
        });
        // Guardar productos actualizados en localStorage
        localStorage.setItem('productos', JSON.stringify(actualizados));
        return actualizados;
      });
      limpiarCarrito();
      if (window && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new Event('ventaRealizada'));
      }
    } catch (error) {
      showSnackbar('Error al guardar venta', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const formatCurrency = (value: number | undefined | null) => {
    if (typeof value !== 'number' || isNaN(value)) return 'S/ 0.00';
    return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
  };

  const handleFinalizarVenta = () => {
    setModalPago(true);
  };

  const handleConfirmarVenta = async () => {
    if (metodoPago === 'efectivo' && (parseFloat(recibido) < calcularTotal())) {
      showSnackbar('El monto recibido es insuficiente', 'error');
      return;
    }
    await finalizarVenta();
    setModalPago(false);
    setMetodoPago('efectivo');
    setRecibido('');
    setVuelto(0);
  };

  // Filtro de productos por búsqueda
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );
  // Agrupar productos filtrados por categoría
  const productosPorCategoria = categorias.map(cat => ({
    ...cat,
    productos: productosFiltrados.filter(p => p.categoriaId === cat.id)
  })).filter(cat => cat.productos.length > 0);

  // Función para imprimir solo la boleta
  const imprimirBoleta = () => {
    const printContents = document.getElementById('boleta-print')?.innerHTML;
    if (!printContents) return;
    const win = window.open('', '', 'width=400,height=600');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Boleta de Venta</title>
          <style>
            body { font-family: monospace; font-size: 14px; margin: 0; padding: 10px; }
            .divider { border-bottom: 1px dashed #000; margin: 8px 0; }
            .center { text-align: center; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Columna de productos/acordeón (80%) */}
        <Grid item xs={12} md={9} lg={9}>
          <Box mb={3}>
            <TextField
              label="Buscar producto"
              variant="outlined"
              fullWidth
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: search && (
                  <IconButton aria-label="Limpiar búsqueda" onClick={() => setSearch('')} edge="end">
                    <Clear />
                  </IconButton>
                )
              }}
            />
          </Box>
          {productosPorCategoria.length === 0 ? (
            <Typography color="text.secondary">No se encontraron productos.</Typography>
          ) : (
            productosPorCategoria.map(cat => (
              <Accordion key={cat.id} TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" fontWeight="bold">{cat.nombre}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    {cat.productos.map((producto, idx) => (
                      <Grid item xs={12} sm={4} md={4} key={producto.id}>
                        <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, height: 250, minWidth: 0, maxWidth: 300, mx: 'auto', boxShadow: 3, border: producto.stockActual < 10 ? '2px solid #ff9800' : undefined }}>
                          <CardMedia
                            component="img"
                            image={producto.imagen || imagenesBebidas[producto.nombre] || 'https://cdn-icons-png.flaticon.com/512/2738/2738897.png'}
                            alt={producto.nombre}
                            sx={{ width: 70, height: 120, objectFit: 'contain', borderRadius: 2, bgcolor: '#f5f5f5', mb: 1 }}
                          />
                          <Typography variant="h6" fontWeight="bold" noWrap>{producto.nombre}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }}>{producto.descripcion}</Typography>
                          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" sx={{ mb: 1 }}>
                            <Typography variant="subtitle1" color="primary" fontWeight="bold">{formatCurrency(producto.precioVenta ?? 0)}</Typography>
                            <Typography variant="caption" color={producto.stockActual < 10 ? 'error' : 'text.secondary'} sx={{ fontWeight: producto.stockActual < 10 ? 'bold' : undefined }}>
                              Stock: {producto.stockActual}
                            </Typography>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            fullWidth
                            onClick={() => agregarAlCarrito(producto)}
                            disabled={producto.stockActual === 0}
                            aria-label={`Agregar ${producto.nombre} al carrito`}
                          >
                            <ShoppingCart sx={{ mr: 1 }} fontSize="small" />
                            Agregar
                          </Button>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Grid>
        {/* Columna del carrito (20%) */}
        <Grid item xs={12} md={3} lg={3}>
          <Box sx={{ p: 3, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>
              Carrito de compras
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {carrito.length === 0 ? (
              <Typography color="text.secondary">El carrito está vacío.</Typography>
            ) : (
              <List sx={{ flexGrow: 1, maxHeight: 350, overflowY: 'auto' }}>
                {carrito.map(item => (
                  <ListItem key={item.producto.id} alignItems="flex-start">
                    <ListItemText
                      primary={item.producto.nombre}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {formatCurrency(item.producto.precioVenta ?? 0)} x {item.cantidad}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1} mt={1}>
                            <IconButton size="small" onClick={() => cambiarCantidad(item.producto.id, item.cantidad - 1)} disabled={item.cantidad <= 1}>
                              <Remove />
                            </IconButton>
                            <TextField
                              type="number"
                              size="small"
                              value={item.cantidad}
                              onChange={e => cambiarCantidad(item.producto.id, Math.max(1, Math.min(Number(e.target.value), item.producto.stockActual)))}
                              inputProps={{ min: 1, max: item.producto.stockActual, style: { width: 40, textAlign: 'center' } }}
                            />
                            <IconButton size="small" onClick={() => cambiarCantidad(item.producto.id, item.cantidad + 1)} disabled={item.cantidad >= item.producto.stockActual}>
                              <Add />
                            </IconButton>
                          </Box>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" color="error" onClick={() => quitarDelCarrito(item.producto.id)} aria-label={`Quitar ${item.producto.nombre} del carrito`}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">{formatCurrency(calcularTotal() ?? 0)}</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={carrito.length === 0 || saving}
              onClick={handleFinalizarVenta}
            >
              Finalizar venta
            </Button>
            <Button
              variant="text"
              color="secondary"
              fullWidth
              sx={{ mt: 1 }}
              onClick={limpiarCarrito}
              disabled={carrito.length === 0 || saving}
            >
              Vaciar carrito
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Modal de pago */}
      <Dialog open={modalPago} onClose={() => setModalPago(false)}>
        <DialogTitle>Finalizar venta</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Total a pagar: <b>{formatCurrency(calcularTotal() ?? 0)}</b>
          </Typography>
          <RadioGroup
            row
            value={metodoPago}
            onChange={e => setMetodoPago(e.target.value as 'efectivo' | 'yape')}
            sx={{ mb: 2 }}
          >
            <FormControlLabel value="efectivo" control={<Radio />} label="Efectivo" />
            <FormControlLabel value="yape" control={<Radio />} label="Yape" />
          </RadioGroup>
          {metodoPago === 'efectivo' ? (
            <>
              <TextField
                label="Recibido"
                type="number"
                value={recibido}
                onChange={e => setRecibido(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                }}
                inputProps={{ min: calcularTotal() ?? 0 }}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2">
                Vuelto: <b style={{ color: vuelto < 0 ? 'red' : 'green' }}>{formatCurrency(vuelto ?? 0)}</b>
              </Typography>
            </>
          ) : (
            <Box textAlign="center" sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Escanea el código QR para pagar con Yape
              </Typography>
              <img src={QR_YAPE} alt="QR Yape" style={{ width: 180, height: 180, margin: '0 auto' }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalPago(false)} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarVenta}
            variant="contained"
            color="primary"
            disabled={saving || (metodoPago === 'efectivo' && (parseFloat(recibido) < calcularTotal() ?? 0))}
          >
            Confirmar y registrar venta
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de boleta al finalizar venta */}
      <Dialog open={!!ventaReciente} onClose={() => setVentaReciente(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Venta realizada</DialogTitle>
        <DialogContent dividers>
          {ventaReciente && typeof ventaReciente === 'object' && (
            <Box id="boleta-print" sx={{ fontFamily: 'monospace', fontSize: 14 }}>
              <Box textAlign="center" mb={1}>
                <Typography variant="h6" fontWeight="bold">BOLETA DE VENTA</Typography>
                <Typography variant="body2">Licorería Billar</Typography>
                <Typography variant="body2">Fecha: {new Date(ventaReciente.fecha).toLocaleString('es-PE')}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box>
                {ventaReciente.productosVendidos.map((prod, idx) => (
                  <Box key={idx} display="flex" justifyContent="space-between">
                    <span>{prod.producto.nombre} x{prod.cantidad || 1}</span>
                    <span>S/ {((prod.producto.precioVenta ?? 0) * (prod.cantidad || 1)).toFixed(2)}</span>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <span><b>Total</b></span>
                <span><b>S/ {ventaReciente.total.toFixed(2)}</b></span>
              </Box>
              {ventaReciente.metodoPago && (
                <Box display="flex" justifyContent="space-between">
                  <span>Método:</span>
                  <span>{ventaReciente.metodoPago}</span>
                </Box>
              )}
              {typeof ventaReciente.recibido !== 'undefined' && (
                <Box display="flex" justifyContent="space-between">
                  <span>Recibido:</span>
                  <span>S/ {ventaReciente.recibido?.toFixed(2)}</span>
                </Box>
              )}
              {typeof ventaReciente.vuelto !== 'undefined' && (
                <Box display="flex" justifyContent="space-between">
                  <span>Vuelto:</span>
                  <span>S/ {ventaReciente.vuelto?.toFixed(2)}</span>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box textAlign="center" mt={1}>
                <Typography variant="caption">¡Gracias por su compra!</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVentaReciente(null)} color="secondary">Cerrar</Button>
          <Button onClick={() => imprimirBoleta()} color="primary" variant="contained" startIcon={<Print />}>Imprimir boleta</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VentasPage; 