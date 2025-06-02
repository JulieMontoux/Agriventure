// contexts/AuthContext.tsx - Version avec support vendeurs
import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';


// Contexte pour la connexion avec token jwt (vendeur + admin)


interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
  seller_id?: number;
  seller_name?: string;
}

interface User {
    id?: number;
    username: string;
    role: 'administrator' | 'vendor';
    seller_name?: string;
    seller_id?: number;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    sellerLogin: (username: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    token: string | null;
    isAdmin: boolean;
    isVendor: boolean;
}

const defaultContext: AuthContextType = {
    user: null,
    login: async () => {},
    sellerLogin: async () => {},
    logout: () => {},
    loading: false,
    error: null,
    isAuthenticated: false,
    token: null,
    isAdmin: false,
    isVendor: false,
}

export const AuthContext = createContext<AuthContextType>(defaultContext);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded: DecodedToken = jwtDecode(storedToken);
                if (decoded.exp * 1000 > Date.now()) {
                    setToken(storedToken);
                    setUser({
                        username: decoded.sub,
                        role: decoded.role as 'administrator' | 'vendor',
                        seller_name: decoded.seller_name,
                        seller_id: decoded.seller_id
                    });
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('sellerName');
                }
            } catch (err) {
                console.error('Token invalide:', err);
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('sellerName');
            }
        }
    }, []);

    const login = async (username: string, password: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://127.0.0.1:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Identifiants invalides');
            }

            const data = await response.json();
            const accessToken = data.access_token;

            const decoded: DecodedToken = jwtDecode(accessToken);
            
            localStorage.setItem('token', accessToken);
            localStorage.setItem('userRole', decoded.role);
            setToken(accessToken);
            
            setUser({
                username: decoded.sub,
                role: decoded.role as 'administrator' | 'vendor'
            });

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Échec de connexion';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const sellerLogin = async (username: string, password: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://127.0.0.1:8000/auth/seller-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Échec de connexion vendeur');
            }

            const data = await response.json();
            const accessToken = data.access_token;

            const decoded: DecodedToken = jwtDecode(accessToken);
            
            localStorage.setItem('token', accessToken);
            localStorage.setItem('userRole', 'vendor');
            localStorage.setItem('sellerName', data.user_info.seller_name);
            setToken(accessToken);
            
            setUser({
                username: decoded.sub,
                role: 'vendor',
                seller_name: decoded.seller_name,
                seller_id: decoded.seller_id
            });

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Échec de connexion vendeur';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = (): void => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('sellerName');
    };

    const isAuthenticated = !!token && !!user;
    const isAdmin = user?.role === 'administrator';
    const isVendor = user?.role === 'vendor';

    return (
        <AuthContext.Provider value={{ 
            user, 
            login,
            sellerLogin, 
            logout, 
            loading, 
            error, 
            isAuthenticated,
            token,
            isAdmin,
            isVendor
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};