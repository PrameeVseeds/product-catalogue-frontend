import axios, { AxiosError } from "axios";
import { environment } from "../config/environment";
import { authStorage } from "../utils/authStorage";

export const apiClient = axios.create({
  baseURL: environment.apiUrl,
  timeout: 10_000,
  headers: { Accept: "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      error instanceof AxiosError &&
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/login")
    )
      authStorage.clear();
    return Promise.reject(error);
  },
);

export const getApiErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.code === "ECONNABORTED")
      return "The request took too long. Please try again.";
    const message = (error.response?.data as { message?: unknown } | undefined)
      ?.message;
    if (typeof message === "string" && message.trim()) return message;
    if (!error.response) return "Unable to connect to the server.";
  }
  return "Something went wrong while loading the content.";
};
