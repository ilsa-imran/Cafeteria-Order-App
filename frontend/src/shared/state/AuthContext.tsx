import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { apiFetch } from "../lib/api";
import type { User } from "../types/order";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "cafeteria-auth";

function loadStoredAuth(): { user: User; token: string } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = loadStoredAuth();
    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await apiFetch<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setUser(result.user);
    setToken(result.token);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    return result.user;
  };

  const register = async (name: string, email: string, password: string) => {
    await apiFetch("/auth/register", { method: "POST", body: { name, email, password } });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const value: AuthContextValue = { user, token, isLoading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
