import {useCallback,useEffect,useMemo,useState,type PropsWithChildren,} from "react";
import type { LoginResponse } from "../interfaces/auth.interface";
import { authApi } from "../services/authApi";
import { authStorage } from "../utils/authStorage";
import { AuthContext, type AuthContextValue } from "./authContext";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<LoginResponse | null>(() =>
    authStorage.getSession(),
  );
  useEffect(
    () => authStorage.subscribe(() => setSession(authStorage.getSession())),
    [],
  );
  const login = useCallback<AuthContextValue["login"]>(async (credentials) => {
    const result = await authApi.login(credentials);
    authStorage.setSession(result);
  }, []);
  const logout = useCallback(() => authStorage.clear(), []);
  const value = useMemo<AuthContextValue>(
    () => ({
      admin: session?.admin ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session),
      login,
      logout,
    }),
    [session, login, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
