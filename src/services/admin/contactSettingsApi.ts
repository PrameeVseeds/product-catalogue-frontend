import type { ContactSettingsForm } from "../../interfaces/adminCms.interface";
import { apiClient } from "../apiClient";
import { normalizeContactSettings } from "./cmsNormalizers";
export const contactSettingsApi = {
  async get(): Promise<ContactSettingsForm> {
    const { data } = await apiClient.get<unknown>("/settings/contact");
    return normalizeContactSettings(data);
  },
  async update(input: ContactSettingsForm): Promise<ContactSettingsForm> {
    const { data } = await apiClient.put<unknown>(
      "/admin/settings/contact",
      input,
    );
    return normalizeContactSettings(data);
  },
};
