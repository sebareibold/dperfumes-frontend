"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { apiService } from "../services/api";

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface ApiUser {
  id?: string;
  _id?: string;
  email?: string;
  role?: string;
  name?: string;
  firstName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}

// Componente proveedor
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde sessionStorage al iniciar
  useEffect(() => {
    const storedUser = sessionStorage.getItem("adminUser");
    const storedToken = sessionStorage.getItem("adminToken");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        console.log("AuthContext - Usuario establecido:", parsedUser);
        console.log("token", storedToken);
      } catch (error) {
        console.error("Error al parsear el usuario almacenado:", error);
        sessionStorage.removeItem("adminUser");
        sessionStorage.removeItem("adminToken");
      }
    }

    setLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        console.log(
          "API Service - Intentando iniciar sesión con email:",
          email
        );

        const response = await apiService.login({ email, password });
        if (response && response.success && response.token && response.user && typeof response.user === 'object') {
          const apiUser = response.user as ApiUser;
          const userData = {
            id: apiUser.id || apiUser._id || '',
            email: apiUser.email || '',
            role: apiUser.role || '',
            name: apiUser.name || apiUser.firstName || 'Admin',
          };
          sessionStorage.setItem("adminUser", JSON.stringify(userData));
          setUser(userData);
          setToken(typeof response.token === "string" ? response.token : null);
          sessionStorage.setItem("adminToken", typeof response.token === "string" ? response.token : "");
          console.log("AuthContext - Login exitoso:", userData);
          return true;
        } else {
          console.error("AuthContext - Respuesta de login inválida:", response);
          return false;
        }
      } catch (error) {
        console.error("AuthContext - Error en login:", error);
        throw error;
      }
    },
    []
  ); // Dependencias vacías porque apiService es una instancia singleton y setUser/setToken son estables.

  const logout = useCallback(() => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");
    setUser(null);
    setToken(null);
    console.log("AuthContext - Usuario desconectado");
  }, []); // Dependencias vacías porque setUser/setToken son estables.

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      isAuthenticated: !!user && !!token,
    }),
    [user, token, loading, login, logout]
  ); // Dependencias para useMemo

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
