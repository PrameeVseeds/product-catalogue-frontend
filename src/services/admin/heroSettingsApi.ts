import type { HeroSettingsForm } from "../../interfaces/adminCms.interface";
import { apiClient } from "../apiClient";
import { normalizeHeroSettings } from "./cmsNormalizers";
export const heroSettingsApi = {
  async get(): Promise<HeroSettingsForm> {
    const { data } = await apiClient.get<unknown>("/settings/hero");
    return normalizeHeroSettings(data);
  },
  async update(input: HeroSettingsForm): Promise<HeroSettingsForm> {
    const { data } = await apiClient.put<unknown>(
      "/admin/settings/hero",
      input,
    );
    return normalizeHeroSettings(data);
  },
};
