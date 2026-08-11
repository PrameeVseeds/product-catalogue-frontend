import type { ThemeSettingsForm } from "../../interfaces/adminCms.interface";
import { apiClient } from "../apiClient";
import { normalizeThemeSettings } from "./cmsNormalizers";
export const themeSettingsApi = {
  async get(): Promise<ThemeSettingsForm> {
    const { data } = await apiClient.get<unknown>("/settings/theme");
    return normalizeThemeSettings(data);
  },
  async update(input: ThemeSettingsForm): Promise<ThemeSettingsForm> {
    const { data } = await apiClient.put<unknown>(
      "/admin/settings/theme",
      input,
    );
    return normalizeThemeSettings(data);
  },
};
