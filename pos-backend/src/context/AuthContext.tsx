import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface AuthContextType {
    token: string | null;
    nombreUsuario: string | null;
    nombreCompleto: string | null;
    rol: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [nombreUsuario, setNombreUsuario] = useState<string | null>(localStorage.getItem('nombreUsuario'));
    const [nombreCompleto, setNombreCompleto] = useState<string | null>(localStorage.getItem('nombreCompleto'));
    const [rol, setRol] = useState<string | null>(localStorage.getItem('rol'));
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            const { token, nombreUsuario, nombreCompleto, rol } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('nombreUsuario', nombreUsuario);
            localStorage.setItem('nombreCompleto', nombreCompleto);
            localStorage.setItem('rol', rol);
            
            setToken(token);
            setNombreUsuario(nombreUsuario);
            setNombreCompleto(nombreCompleto);
            setRol(rol);
            
            navigate('/');
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('nombreUsuario');
        localStorage.removeItem('nombreCompleto');
        localStorage.removeItem('rol');
        
        setToken(null);
        setNombreUsuario(null);
        setNombreCompleto(null);
        setRol(null);
        
        navigate('/auth');
    };

    const value = {
        token,
        nombreUsuario,
        nombreCompleto,
        rol,
        login,
        logout,
        isAuthenticated: !!token
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 