// Interfaces principales para el sistema POS

export interface User {
    nombreUsuario: string;
    nombreCompleto: string;
    rol: 'ADMINISTRADOR' | 'CAJERO';
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precioVenta: number;
    stockActual: number;
    categoriaId: number;
    imagen?: string;
    activo?: boolean;
    cantidad?: number; // cantidad vendida (solo en ventas)
}

export interface LoginData {
    nombreUsuario: string;
    password: string;
}

export interface RegisterData extends LoginData {
    confirmPassword: string;
    nombreCompleto: string;
    rol: 'ADMINISTRADOR' | 'CAJERO';
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface VentaProducto {
  producto: Producto;
  cantidad: number;
}

export interface Venta {
  id: number;
  productosVendidos: VentaProducto[];
  total: number;
  fecha: string; // ISO string
  metodoPago?: string;
  recibido?: number;
  vuelto?: number;
}

export interface Usuario {
  username: string;
  rol?: string;
  name?: string;
}

export interface Credenciales {
  username: string;
  password: string;
}

export interface DashboardStats {
  productosActivos: number;
  ventasHoy: number;
  ingresosHoy: number;
  productosBajos: number;
  productosVendidos: number;
} 