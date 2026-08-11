import type { Admin, LoginResponse } from "../interfaces/auth.interface";

const storageKey = "catalogueAdminAuth";
const listeners = new Set<() => void>();

const isTokenCurrent = (token: string): boolean => {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    ) as { exp?: unknown };
    return typeof payload.exp !== "number" || payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const read = (): LoginResponse | null => {
  try {
    const value = localStorage.getItem(storageKey);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<LoginResponse>;
    const admin = parsed.admin as Partial<Admin> | undefined;
    if (
      typeof parsed.token !== "string" ||
      !isTokenCurrent(parsed.token) ||
      typeof admin?.id !== "number" ||
      typeof admin.name !== "string" ||
      typeof admin.email !== "string"
    ) {
      localStorage.removeItem(storageKey);
      return null;
    }
    return {
      token: parsed.token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    };
  } catch {
    localStorage.removeItem(storageKey);
    return null;
  }
};

const emit = () => listeners.forEach((listener) => listener());
export const authStorage = {
  getSession: read,
  getToken: () => read()?.token ?? null,
  setSession: (session: LoginResponse) => {
    localStorage.setItem(storageKey, JSON.stringify(session));
    emit();
  },
  clear: () => {
    localStorage.removeItem(storageKey);
    emit();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
