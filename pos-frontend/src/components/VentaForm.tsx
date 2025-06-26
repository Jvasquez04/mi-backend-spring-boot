import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { Venta, Producto } from '../types';
import { getProductos } from '../services/api';

interface VentaFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (venta: Omit<Venta, 'id' | 'fecha'>) => void;
  loading?: boolean;
}

interface ProductoSeleccionado {
  producto: Producto;
  cantidad: number;
}

const VentaForm: React.FC<VentaFormProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<number | ''>('');
  const [cantidad, setCantidad] = useState<number>(1);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Aquí puedes redirigir al login o mostrar un mensaje de error
      return;
    }
    try {
      const data = await getProductos(token);
      setProductos(data);
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  const handleAddProducto = () => {
    if (productoSeleccionado && cantidad > 0) {
      const producto = productos.find(p => p.id === productoSeleccionado);
      if (producto) {
        const existingIndex = productosSeleccionados.findIndex(
          ps => ps.producto.id === producto.id
        );

        if (existingIndex >= 0) {
          // Actualizar cantidad si ya existe
          const updated = [...productosSeleccionados];
          updated[existingIndex].cantidad += cantidad;
          setProductosSeleccionados(updated);
        } else {
          // Agregar nuevo producto
          setProductosSeleccionados(prev => [
            ...prev,
            { producto, cantidad }
          ]);
        }
        setProductoSeleccionado('');
        setCantidad(1);
      }
    }
  };

  const handleRemoveProducto = (index: number) => {
    setProductosSeleccionados(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateCantidad = (index: number, newCantidad: number) => {
    if (newCantidad > 0) {
      setProductosSeleccionados(prev => 
        prev.map((ps, i) => 
          i === index ? { ...ps, cantidad: newCantidad } : ps
        )
      );
    }
  };

  const calculateTotal = () => {
    return productosSeleccionados.reduce(
      (total, ps) => total + (ps.producto.precioVenta * ps.cantidad),
      0
    );
  };

  const handleSubmit = () => {
    if (productosSeleccionados.length > 0) {
      const ventaData: Omit<Venta, 'id' | 'fecha'> = {
        productosVendidos: productosSeleccionados.map(ps => ({ producto: ps.producto, cantidad: ps.cantidad })),
        total: calculateTotal()
      };
      onSubmit(ventaData);
    }
  };

  const formatCurrency = (value: number) => {
    return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Nueva Venta</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* Selección de productos */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <FormControl fullWidth>
              <InputLabel>Producto</InputLabel>
              <Select
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(e.target.value as number)}
                label="Producto"
              >
                {productos.map((producto) => (
                  <MenuItem key={producto.id} value={producto.id}>
                    {producto.nombre} - {formatCurrency(producto.precioVenta)} (Stock: {producto.stockActual})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Cantidad"
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
              inputProps={{ min: 1 }}
              sx={{ width: 120 }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddProducto}
              disabled={!productoSeleccionado || cantidad <= 0}
            >
              Agregar
            </Button>
          </Box>

          {/* Lista de productos seleccionados */}
          {productosSeleccionados.length > 0 && (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="center">Cantidad</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productosSeleccionados.map((ps, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {ps.producto.nombre}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(ps.producto.precioVenta)}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateCantidad(index, ps.cantidad - 1)}
                            disabled={ps.cantidad <= 1}
                          >
                            <Remove />
                          </IconButton>
                          <Typography sx={{ mx: 1, minWidth: 30, textAlign: 'center' }}>
                            {ps.cantidad}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateCantidad(index, ps.cantidad + 1)}
                            disabled={ps.cantidad >= ps.producto.stockActual}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2" fontWeight="bold">
                          {formatCurrency(ps.producto.precioVenta * ps.cantidad)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveProducto(index)}
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

          {/* Total */}
          {productosSeleccionados.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Chip
                label={`Total: ${formatCurrency(calculateTotal())}`}
                color="primary"
                size="medium"
                sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || productosSeleccionados.length === 0}
        >
          {loading ? 'Guardando...' : 'Finalizar Venta'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VentaForm; 