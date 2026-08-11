import { AxiosError } from "axios";
import type { LoginRequest, LoginResponse } from "../interfaces/auth.interface";
import { apiClient } from "./apiClient";
import { asRecord, unwrapData } from "./responseNormalizers";

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<unknown>("/auth/login", credentials);
    const result = asRecord(unwrapData(data));
    const admin = asRecord(result.admin);
    if (
      typeof result.token !== "string" ||
      typeof admin.id !== "number" ||
      typeof admin.name !== "string" ||
      typeof admin.email !== "string"
    )
      throw new Error("INVALID_AUTH_RESPONSE");
    return {
      token: result.token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    };
  },
};

export const getLoginErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401)
      return "The email or password is incorrect.";
    if (error.response?.status === 403)
      return "This admin account is not active.";
    if (!error.response)
      return "Unable to connect. Please check your connection and try again.";
  }
  return "Login could not be completed. Please try again.";
};
