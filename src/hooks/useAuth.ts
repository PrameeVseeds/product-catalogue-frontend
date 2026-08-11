import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "../contexts/authContext";

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
