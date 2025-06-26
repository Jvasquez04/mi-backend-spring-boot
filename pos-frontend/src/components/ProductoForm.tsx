import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Avatar,
  SelectChangeEvent
} from '@mui/material';
import { Producto, Categoria } from '../types';
import { getCategorias } from '../services/api';
import { getToken } from '../utils/auth';

const imagenesBebidas: Record<string, string> = {
  'Ron Barceló': 'https://www.licoresmedellin.com/cdn/shop/products/ron-barcelo-anejo-700ml.jpg?v=1677692782',
  'Cerveza Corona': 'https://www.latiendadelcervecero.com/cdn/shop/products/Corona355ml.png?v=1614359782',
  'Tequila Don Julio': 'https://cdn.shopify.com/s/files/1/0257/6089/3921/products/tequila-don-julio-reposado-750ml.png?v=1642521072',
  'Whisky Johnnie Walker': 'https://www.licoresmedellin.com/cdn/shop/products/whisky-johnnie-walker-red-label-700ml.jpg?v=1677692782',
  'Vodka Smirnoff': 'https://www.latiendadelcervecero.com/cdn/shop/products/Smirnoff700ml.png?v=1614359782',
};

interface ProductoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (producto: Omit<Producto, 'id'> & { imagen?: string }) => void;
  producto?: Producto & { imagen?: string };
  loading?: boolean;
}

// Tipo local para el formulario
interface ProductoFormData {
  nombre: string;
  descripcion: string;
  precioVenta: string;
  stock: string;
  imagen?: string;
  categoriaId: number;
}

const ProductoForm: React.FC<ProductoFormProps> = ({
  open,
  onClose,
  onSubmit,
  producto,
  loading = false
}) => {
  const [formData, setFormData] = useState<ProductoFormData>({
    nombre: '',
    descripcion: '',
    precioVenta: '',
    stock: '',
    imagen: '',
    categoriaId: 0
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [precioError, setPrecioError] = useState('');
  const [stockError, setStockError] = useState('');
  const [nombreError, setNombreError] = useState('');
  const [categoriaError, setCategoriaError] = useState('');
  const [imagenError, setImagenError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precioVenta: producto.precioVenta ? producto.precioVenta.toString() : '',
        stock: producto.stockActual ? producto.stockActual.toString() : '',
        imagen: (producto as any).imagen || '',
        categoriaId: producto.categoriaId || 0
      });
      setLocalImage(null);
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        precioVenta: '',
        stock: '',
        imagen: '',
        categoriaId: 0
      });
      setLocalImage(null);
    }
  }, [producto]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = getToken();
        if (!token) return;
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
    fetchCategorias();
  }, []);

  const validateField = (field: keyof ProductoFormData, value: string) => {
    if (field === 'precioVenta') {
      const precioNum = parseFloat(value);
      if (value === '' || isNaN(precioNum) || precioNum <= 0) {
        return 'El precio debe ser mayor a 0';
      }
    }
    if (field === 'stock') {
      const stockNum = parseInt(value);
      if (value === '' || isNaN(stockNum) || stockNum <= 0) {
        return 'El stock debe ser mayor a 0';
      }
    }
    return '';
  };

  const validateImageUrl = (url: string) => {
    if (!url) return '';
    try {
      new URL(url);
      return '';
    } catch {
      return 'URL de imagen no válida';
    }
  };

  const handleChange = (field: keyof ProductoFormData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    let value: any = event.target.value;
    if (field === 'precioVenta') {
      setPrecioError(validateField('precioVenta', value));
    }
    if (field === 'stock') {
      setStockError(validateField('stock', value));
    }
    if (field === 'nombre') {
      setNombreError(value.trim() === '' ? 'El nombre es obligatorio' : '');
    }
    if (field === 'imagen') {
      setImagenError(validateImageUrl(value));
    }
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<number>) => {
    setFormData(prev => ({
      ...prev,
      categoriaId: Number(event.target.value)
    }));
    setCategoriaError(Number(event.target.value) === 0 ? 'Seleccione una categoría' : '');
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLocalImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let valid = true;
    if (formData.nombre.trim() === '') {
      setNombreError('El nombre es obligatorio');
      valid = false;
    } else {
      setNombreError('');
    }
    if (formData.precioVenta === '' || isNaN(Number(formData.precioVenta)) || Number(formData.precioVenta) <= 0) {
      setPrecioError('El precio debe ser mayor a 0');
      valid = false;
    } else {
      setPrecioError('');
    }
    if (formData.stock === '' || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      setStockError('El stock es obligatorio y no puede ser negativo');
      valid = false;
    } else {
      setStockError('');
    }
    if (formData.categoriaId === 0) {
      setCategoriaError('Seleccione una categoría');
      valid = false;
    } else {
      setCategoriaError('');
    }
    if (formData.imagen && validateImageUrl(formData.imagen)) {
      setImagenError('URL de imagen no válida');
      valid = false;
    } else {
      setImagenError('');
    }
    if (!valid) return;
    setSuccessMsg('');
    let imagenFinal: string | undefined = undefined;
    if (localImage && localImage.trim() !== '') {
      imagenFinal = localImage;
    } else if (formData.imagen && formData.imagen.trim() !== '') {
      imagenFinal = formData.imagen;
    } else if (producto?.imagen && producto.imagen.trim() !== '') {
      imagenFinal = producto.imagen;
    }
    onSubmit({
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precioVenta: Number(formData.precioVenta),
      stockActual: Number(formData.stock),
      ...(imagenFinal ? { imagen: imagenFinal } : {}),
      categoriaId: formData.categoriaId
    });
    setSuccessMsg(producto ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
  };

  // Imagen de vista previa
  const imagenPreview = localImage
    || formData.imagen
    || (producto && producto.imagen)
    || imagenesBebidas[formData.nombre]
    || 'https://cdn-icons-png.flaticon.com/512/2738/2738897.png';

  // Log para depuración
  console.log('imagenPreview:', imagenPreview, 'localImage:', localImage, 'formData.imagen:', formData.imagen, 'producto?.imagen:', producto?.imagen);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {producto ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Box mb={2}>
              <span style={{ color: 'red' }}>{error}</span>
            </Box>
          )}
          {successMsg && (
            <Box mb={2}>
              <span style={{ color: 'green' }}>{successMsg}</span>
            </Box>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nombre"
              value={formData.nombre}
              onChange={handleChange('nombre')}
              required
              fullWidth
              error={!!nombreError}
              helperText={nombreError}
            />
            <TextField
              label="Descripción"
              value={formData.descripcion}
              onChange={handleChange('descripcion')}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Precio"
              type="number"
              value={formData.precioVenta}
              onChange={handleChange('precioVenta')}
              required
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              error={!!precioError}
              helperText={precioError}
            />
            <TextField
              label="Stock"
              type="number"
              value={formData.stock}
              onChange={handleChange('stock')}
              required
              fullWidth
              inputProps={{ min: 0 }}
              error={!!stockError}
              helperText={stockError}
            />
            <FormControl fullWidth required error={!!categoriaError}>
              <InputLabel id="categoria-label">Categoría</InputLabel>
              <Select
                labelId="categoria-label"
                value={formData.categoriaId}
                label="Categoría"
                onChange={handleSelectChange}
              >
                <MenuItem value={0} disabled>Seleccione una categoría</MenuItem>
                {categorias.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.nombre}</MenuItem>
                ))}
              </Select>
              {categoriaError && <span style={{ color: 'red', fontSize: 12 }}>{categoriaError}</span>}
            </FormControl>
            <Box display="flex" alignItems="center" gap={2} mt={2}>
              <Avatar
                variant="rounded"
                src={imagenPreview}
                alt={formData.nombre}
                sx={{ width: 56, height: 80, bgcolor: '#f5f5f5' }}
              />
              <Button
                variant="outlined"
                component="label"
                size="small"
                sx={{ minWidth: 120 }}
              >
                Seleccionar imagen
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              <TextField
                label="URL de la imagen"
                value={formData.imagen}
                onChange={handleChange('imagen')}
                error={!!imagenError}
                helperText={imagenError || 'Pega la URL de la imagen o déjalo vacío para usar la predeterminada'}
                fullWidth
                placeholder="Pega la URL de la imagen o déjalo vacío para usar la predeterminada"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !formData.nombre}
          >
            {loading ? 'Guardando...' : (producto ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductoForm; 