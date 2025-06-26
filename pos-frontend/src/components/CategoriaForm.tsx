import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';
import { Categoria } from '../types';

interface CategoriaFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (categoria: Omit<Categoria, 'id'>) => void;
  categoria?: Categoria;
  loading?: boolean;
}

const CategoriaForm: React.FC<CategoriaFormProps> = ({
  open,
  onClose,
  onSubmit,
  categoria,
  loading = false
}) => {
  const [formData, setFormData] = useState<Omit<Categoria, 'id'>>({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || ''
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: ''
      });
    }
  }, [categoria]);

  const handleChange = (field: keyof Omit<Categoria, 'id'>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nombre"
              value={formData.nombre}
              onChange={handleChange('nombre')}
              required
              fullWidth
            />
            <TextField
              label="Descripción"
              value={formData.descripcion}
              onChange={handleChange('descripcion')}
              multiline
              rows={3}
              fullWidth
            />
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
            {loading ? 'Guardando...' : (categoria ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoriaForm; 