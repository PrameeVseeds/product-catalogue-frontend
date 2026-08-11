import type {AdminSocialMedia,SocialMediaForm,} from "../../interfaces/adminCms.interface";
import { apiClient } from "../apiClient";
import { unwrapData } from "../responseNormalizers";
import { normalizeSocialMedia } from "./cmsNormalizers";
export const socialMediaApi = {
  async getAll(): Promise<AdminSocialMedia[]> {
    const { data } = await apiClient.get<unknown>("/admin/social-media");
    return normalizeSocialMedia(data);
  },
  async create(input: SocialMediaForm): Promise<AdminSocialMedia> {
    const { data } = await apiClient.post<unknown>(
      "/admin/social-media",
      input,
    );
    return normalizeSocialMedia({ data: [unwrapData(data)] })[0];
  },
  async update(id: number, input: SocialMediaForm): Promise<AdminSocialMedia> {
    const { data } = await apiClient.put<unknown>(
      `/admin/social-media/${id}`,
      input,
    );
    return normalizeSocialMedia({ data: [unwrapData(data)] })[0];
  },
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/admin/social-media/${id}`);
  },
};
