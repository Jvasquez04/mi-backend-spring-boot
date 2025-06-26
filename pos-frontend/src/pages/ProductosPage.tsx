import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Alert,
  Snackbar,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  ButtonGroup
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { Producto, Categoria } from '../types';
import { getCategorias } from '../services/api';
import ProductoForm from '../components/ProductoForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Imágenes de ejemplo para bebidas
const imagenesBebidas: Record<string, string> = {
  'Ron Barceló': 'https://www.licoresmedellin.com/cdn/shop/products/ron-barcelo-anejo-700ml.jpg?v=1677692782',
  'Cerveza Corona': 'https://www.latiendadelcervecero.com/cdn/shop/products/Corona355ml.png?v=1614359782',
  'Tequila Don Julio': 'https://cdn.shopify.com/s/files/1/0257/6089/3921/products/tequila-don-julio-reposado-750ml.png?v=1642521072',
  'Whisky Johnnie Walker': 'https://www.licoresmedellin.com/cdn/shop/products/whisky-johnnie-walker-red-label-700ml.jpg?v=1677692782',
  'Vodka Smirnoff': 'https://www.latiendadelcervecero.com/cdn/shop/products/Smirnoff700ml.png?v=1614359782',
};

const ProductosPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | undefined>();
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number>(0);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!authLoading && user?.rol === 'CAJERO') {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

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

  const fetchCategorias = async () => {
    if (!token) return;
    try {
      const data = await getCategorias(token);
      let categoriasArray = [];
      if (Array.isArray(data)) {
        categoriasArray = data;
      } else if (data && Array.isArray(data.content)) {
        categoriasArray = data.content;
      }
      setCategorias(categoriasArray);
    } catch (error) {
      console.error('Error fetching categorias:', error);
      setCategorias([]);
    }
  };

  const handleCreate = () => {
    setEditingProducto(undefined);
    setFormOpen(true);
  };

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const nuevosProductos = productos.filter(p => p.id !== id);
      setProductos(nuevosProductos);
      localStorage.setItem('productos', JSON.stringify(nuevosProductos));
      showSnackbar('Producto eliminado exitosamente', 'success');
    }
  };

  const handleSubmit = (productoData: Omit<Producto, 'id'>) => {
    setSaving(true);
    let imagenFinal = productoData.imagen;
    if (!imagenFinal || imagenFinal.trim() === '') {
      imagenFinal = imagenesBebidas[productoData.nombre] || 'https://cdn-icons-png.flaticon.com/512/2738/2738897.png';
    }
    const productoDataConImagen = { ...productoData, imagen: imagenFinal };
    let nuevosProductos;
    if (editingProducto) {
      // Editar producto existente
      nuevosProductos = productos.map(p =>
        p.id === editingProducto.id ? { ...p, ...productoDataConImagen } : p
      );
      showSnackbar('Producto actualizado exitosamente', 'success');
    } else {
      // Crear nuevo producto
      const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
      nuevosProductos = [...productos, { ...productoDataConImagen, id: nuevoId }];
      showSnackbar('Producto creado exitosamente', 'success');
    }
    setProductos(nuevosProductos);
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));
    setFormOpen(false);
    setSaving(false);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const formatCurrency = (value: number | undefined | null) => {
    if (typeof value !== 'number' || isNaN(value)) return 'S/ 0.00';
    return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
  };

  const productosFiltrados = productos.filter(p =>
    (categoriaSeleccionada === 0 || p.categoriaId === categoriaSeleccionada) &&
    (p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const handleLimpiarDatos = () => {
    localStorage.removeItem('productos');
    localStorage.removeItem('ventas');
    localStorage.removeItem('categorias');
    window.location.reload();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gestión de Productos
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
          >
            Nuevo Producto
          </Button>
        </Box>
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <ButtonGroup variant="outlined" color="primary">
          <Button
            key={0}
            variant={categoriaSeleccionada === 0 ? 'contained' : 'outlined'}
            onClick={() => setCategoriaSeleccionada(0)}
          >
            Todas
          </Button>
          {categorias.map(cat => (
            <Button
              key={cat.id}
              variant={categoriaSeleccionada === cat.id ? 'contained' : 'outlined'}
              onClick={() => setCategoriaSeleccionada(cat.id)}
            >
              {cat.nombre}
            </Button>
          ))}
        </ButtonGroup>
        <TextField
          label="Buscar producto"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          variant="outlined"
          sx={{ minWidth: 250 }}
        />
      </Box>

      {productosFiltrados.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay productos que coincidan con la búsqueda o filtro
          </Typography>
        </Paper>
      ) : (
        categorias
          .filter(cat => categoriaSeleccionada === 0 || cat.id === categoriaSeleccionada)
          .map(cat => {
            const productosDeCategoria = productosFiltrados.filter(p => p.categoriaId === cat.id);
            if (productosDeCategoria.length === 0) return null;
            return (
              <Box key={cat.id} mb={4}>
                <Typography variant="h5" sx={{ mb: 2, mt: 2 }}>
                  {cat.nombre}
                </Typography>
                <Box sx={{ mb: 2, ml: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total de productos: {productosDeCategoria.length} | Stock total: {productosDeCategoria.reduce((sum, p) => sum + p.stockActual, 0)}
                  </Typography>
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Imagen</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell align="left">Descripción</TableCell>
                        <TableCell align="right">Precio</TableCell>
                        <TableCell align="right">Stock</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productosDeCategoria.map((producto) => (
                        <TableRow key={producto.id}>
                          <TableCell>
                            <Avatar
                              variant="rounded"
                              src={producto.imagen || imagenesBebidas[producto.nombre] || 'https://cdn-icons-png.flaticon.com/512/2738/2738897.png'}
                              alt={producto.nombre}
                              sx={{ width: 40, height: 60, bgcolor: '#f5f5f5' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ textDecoration: producto.stockActual === 0 ? 'line-through' : 'none', color: producto.stockActual === 0 ? 'gray' : 'inherit' }}>
                              {producto.nombre}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="body2" color="text.secondary">
                              {producto.descripcion}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle2" fontWeight="bold">
                              {formatCurrency(Number(producto.precioVenta))}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={producto.stockActual}
                              color={producto.stockActual < 10 ? 'error' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(producto)}
                              color="primary"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(producto.id)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            );
          })
      )}

      <ProductoForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        producto={editingProducto}
        loading={saving}
      />

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

export default ProductosPage; 