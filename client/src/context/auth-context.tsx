// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { loginUser, logoutUser } from "../api/auth";
import { getCurrentUser } from "@/api/user";
import type { LoginResponse } from '../features/response';

type User = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }:AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    const data = await loginUser(email, password);
    setUser(data.user);
    return data;
  };

  const logout = async ():Promise<void> => {
    await logoutUser();
    setUser(null);
  };

  useEffect(() => {
    // auto-login if refresh token valid
    const fetchUser = async () => {
      try {
        const  user = await getCurrentUser();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
