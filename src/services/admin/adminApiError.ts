import { AxiosError } from "axios";
export const getAdminApiError = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    if (error.response?.status === 409)
      return "This value conflicts with an existing record.";
    if (error.response?.status === 400)
      return "Some submitted values are invalid. Please review the form.";
    if (!error.response) return "Unable to connect to the server.";
  }
  return fallback;
};
