import type { EnquirySettingsForm } from "../../interfaces/adminCms.interface";
import { apiClient } from "../apiClient";
import { normalizeEnquirySettings } from "./cmsNormalizers";
export const enquirySettingsApi = {
  async get(): Promise<EnquirySettingsForm> {
    const { data } = await apiClient.get<unknown>("/settings/enquiry");
    return normalizeEnquirySettings(data);
  },
  async update(input: EnquirySettingsForm): Promise<EnquirySettingsForm> {
    const { data } = await apiClient.put<unknown>(
      "/admin/settings/enquiry",
      input,
    );
    return normalizeEnquirySettings(data);
  },
};
