import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginData } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginData) => Promise<boolean>;
  logout: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: false,
  login: async () => false,
  logout: () => {},
  user: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginData) => {
    // Validación local de credenciales
    const validUsers: User[] = [
      { nombreUsuario: 'admin', rol: 'ADMINISTRADOR', nombreCompleto: 'Administrador' },
      { nombreUsuario: 'cajero', rol: 'CAJERO', nombreCompleto: 'Cajero' }
    ];
    const user = validUsers.find(
      u => u.nombreUsuario === credentials.nombreUsuario &&
        ((u.nombreUsuario === 'admin' && credentials.password === 'admin123') ||
         (u.nombreUsuario === 'cajero' && credentials.password === 'cajero123'))
    );
    if (user) {
      localStorage.setItem('token', 'dummy-token');
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
      setUser(user);
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 