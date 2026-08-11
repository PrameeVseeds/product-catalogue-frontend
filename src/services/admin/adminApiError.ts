import { AxiosError } from "axios";
export const getAdminApiError = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    const message = (error.response?.data as { message?: unknown } | undefined)
      ?.message;
    if (
      [400, 404, 409].includes(error.response?.status ?? 0) &&
      typeof message === "string"
    )
      return message;
    if (!error.response) return "Unable to connect to the server.";
  }
  return fallback;
};
