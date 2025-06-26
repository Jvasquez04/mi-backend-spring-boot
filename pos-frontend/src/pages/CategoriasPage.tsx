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
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { Categoria } from '../types';
import CategoriaForm from '../components/CategoriaForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { getToken } from '../utils/auth';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CategoriasPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | undefined>();
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (!authLoading && user?.rol === 'CAJERO') {
      navigate('/dashboard');
    }
    fetchCategorias();
  }, [user, authLoading, navigate]);

  const fetchCategorias = () => {
    setLoading(true);
    const categoriasLocal = JSON.parse(localStorage.getItem('categorias') || '[]');
    setCategorias(categoriasLocal);
    setLoading(false);
  };

  const handleCreate = () => {
    setEditingCategoria(undefined);
    setFormOpen(true);
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const tieneProductos = productos.some((p: any) => p.categoriaId === id);
    if (tieneProductos) {
      showSnackbar('No se puede eliminar la categoría porque tiene productos asociados.', 'error');
      return;
    }
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      const nuevasCategorias = categorias.filter(c => c.id !== id);
      setCategorias(nuevasCategorias);
      localStorage.setItem('categorias', JSON.stringify(nuevasCategorias));
      showSnackbar('Categoría eliminada exitosamente', 'success');
    }
  };

  const handleSubmit = (categoriaData: Omit<Categoria, 'id'>) => {
    setSaving(true);
    let nuevasCategorias;
    if (editingCategoria) {
      nuevasCategorias = categorias.map(c =>
        c.id === editingCategoria.id ? { ...c, ...categoriaData } : c
      );
      showSnackbar('Categoría actualizada exitosamente', 'success');
    } else {
      const nuevoId = categorias.length > 0 ? Math.max(...categorias.map(c => c.id)) + 1 : 1;
      nuevasCategorias = [...categorias, { ...categoriaData, id: nuevoId }];
      showSnackbar('Categoría creada exitosamente', 'success');
    }
    setCategorias(nuevasCategorias);
    localStorage.setItem('categorias', JSON.stringify(nuevasCategorias));
    setFormOpen(false);
    setSaving(false);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  if (authLoading || loading) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gestión de Categorías
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Nueva Categoría
        </Button>
      </Box>

      {categorias.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay categorías registradas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comienza agregando tu primera categoría
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {categoria.nombre}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {categoria.descripcion || 'Sin descripción'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(categoria)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(categoria.id)}
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
      )}

      <CategoriaForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        categoria={editingCategoria}
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

export default CategoriasPage; 