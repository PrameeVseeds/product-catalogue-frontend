import { createContext } from "react";
import type { Admin, LoginRequest } from "../interfaces/auth.interface";

export interface AuthContextValue {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
