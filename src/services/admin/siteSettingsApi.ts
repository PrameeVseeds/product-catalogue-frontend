import type { SiteSettingsForm } from "../../interfaces/adminCms.interface";
import { apiClient } from "../apiClient";
import { normalizeSiteSettings } from "./cmsNormalizers";
export const siteSettingsApi = {
  async get(): Promise<SiteSettingsForm> {
    const { data } = await apiClient.get<unknown>("/settings/site");
    return normalizeSiteSettings(data);
  },
  async update(input: SiteSettingsForm): Promise<SiteSettingsForm> {
    const { data } = await apiClient.put<unknown>(
      "/admin/settings/site",
      input,
    );
    return normalizeSiteSettings(data);
  },
};
