import { createContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../service/authService';

interface AuthUser {
  token: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      // você pode buscar dados do usuário, mas por agora vamos só restaurar
      setUser({ token, email: "", name: "" });
    }
  }, []);


  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    localStorage.setItem("token", response.token)
    const authUser: AuthUser = {
      token: response.token,
      email: response.email,
      name: response.name,
    };
    setUser(authUser);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}