import {
    Producto,
    Categoria,
    Venta,
    User,
    LoginData,
    RegisterData,
    DashboardStats
} from '../types';
import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:8080/api';

// Modifico getLocal para no inicializar nada automáticamente
function getLocal<T>(key: string, defaultValue: T): T {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
}

// Productos
export const getProductos = async (token: string) => {
  const res = await axios.get(`${API_URL}/productos`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createProducto = async (productoData: any, token: string) => {
  const res = await axios.post(`${API_URL}/productos`, productoData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateProducto = async (id: number, productoData: any, token: string) => {
  const res = await axios.put(`${API_URL}/productos/${id}`, productoData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteProducto = async (id: number, token: string) => {
  await axios.delete(`${API_URL}/productos/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Categorías
export const getCategorias = async (token: string) => {
  const res = await axios.get(`${API_URL}/categorias`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createCategoria = async (categoriaData: any, token: string) => {
  const res = await axios.post(`${API_URL}/categorias`, categoriaData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateCategoria = async (id: number, categoriaData: any, token: string) => {
  const res = await axios.put(`${API_URL}/categorias/${id}`, categoriaData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteCategoria = async (id: number, token: string) => {
  await axios.delete(`${API_URL}/categorias/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Ventas
export const getVentas = async (): Promise<Venta[]> => {
    const token = getToken();
    const res = await axios.get(`${API_URL}/ventas`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const createVenta = async (ventaData: Omit<Venta, 'id' | 'fecha'>, token: string): Promise<Venta> => {
    const res = await axios.post(`${API_URL}/ventas`, ventaData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

// Estadísticas y reportes
export const getDashboardStats = async (): Promise<DashboardStats> => {
    const res = await axios.get(`${API_URL}/dashboard/stats`);
    return res.data;
};

export const getVentasDeHoy = async (): Promise<Venta[]> => {
    const token = getToken();
    const res = await axios.get(`${API_URL}/ventas`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const hoy = new Date().toISOString().slice(0, 10);
    return res.data.filter((v: Venta) => v.fecha && v.fecha.startsWith(hoy));
};

// Autenticación
export const login = async (credentials: LoginData): Promise<{ token: string, user: User }> => {
    const res = await axios.post(`${API_URL}/auth/login`, credentials);
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    return { token, user };
};

export const register = async (userData: RegisterData): Promise<User> => {
    // Simulación de registro
    if (userData.password !== userData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
    }

    return {
        nombreUsuario: userData.nombreUsuario,
        nombreCompleto: userData.nombreCompleto,
        rol: userData.rol
    };
};