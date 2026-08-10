import type {AdminHomeSection,AdminHomeSectionItem,HomeSectionForm,HomeSectionItemForm,} from "../../interfaces/adminCms.interface";
import { apiClient } from "../apiClient";
import { asArray, unwrapData } from "../responseNormalizers";
import {normalizeHomeSection,normalizeHomeSections,normalizeSectionItem,} from "./cmsNormalizers";
export const homeSectionApi = {
  async getAll(): Promise<AdminHomeSection[]> {
    const { data } = await apiClient.get<unknown>("/admin/home-sections");
    return normalizeHomeSections(data);
  },
  async create(input: HomeSectionForm): Promise<AdminHomeSection> {
    const { data } = await apiClient.post<unknown>(
      "/admin/home-sections",
      input,
    );
    return normalizeHomeSection(unwrapData(data));
  },
  async update(id: number, input: HomeSectionForm): Promise<AdminHomeSection> {
    const { data } = await apiClient.put<unknown>(
      `/admin/home-sections/${id}`,
      input,
    );
    return normalizeHomeSection(unwrapData(data));
  },
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/admin/home-sections/${id}`);
  },
  async getItems(sectionId: number): Promise<AdminHomeSectionItem[]> {
    const { data } = await apiClient.get<unknown>(
      `/admin/home-sections/${sectionId}/items`,
    );
    return asArray(data)
      .map(normalizeSectionItem)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  },
  async createItem(
    sectionId: number,
    input: HomeSectionItemForm,
  ): Promise<AdminHomeSectionItem> {
    const { data } = await apiClient.post<unknown>(
      `/admin/home-sections/${sectionId}/items`,
      input,
    );
    return normalizeSectionItem(unwrapData(data));
  },
  async updateItem(
    id: number,
    input: HomeSectionItemForm,
  ): Promise<AdminHomeSectionItem> {
    const { data } = await apiClient.put<unknown>(
      `/admin/home-section-items/${id}`,
      input,
    );
    return normalizeSectionItem(unwrapData(data));
  },
  async deleteItem(id: number): Promise<void> {
    await apiClient.delete(`/admin/home-section-items/${id}`);
  },
};
