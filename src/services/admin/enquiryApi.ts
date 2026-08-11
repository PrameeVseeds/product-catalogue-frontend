import type {Enquiry,EnquiryDetail,EnquiryFilters,EnquiryListResponse,EnquiryStatus,} from "../../interfaces/admin/enquiry.interface";
import { apiClient } from "../apiClient";
import {asRecord,getId,getNumber,getText,unwrapData,} from "../responseNormalizers";

const statuses: EnquiryStatus[] = ["NEW", "IN_PROGRESS", "CONTACTED", "CLOSED"];
const normalizeEnquiry = (value: unknown): Enquiry => {
  const item = asRecord(value);
  const status = getText(item, "status") as EnquiryStatus;
  return {
    id: Number(getId(item)),
    productId:
      item.product_id === null || item.productId === null
        ? null
        : getNumber(item, 0, "productId", "product_id") || null,
    enquiryType:
      getText(item, "enquiryType", "enquiry_type") === "PRODUCT"
        ? "PRODUCT"
        : "GENERAL",
    name: getText(item, "name") ?? "",
    email: getText(item, "email") ?? "",
    phone: getText(item, "phone"),
    subject: getText(item, "subject"),
    message: getText(item, "message") ?? "",
    status: statuses.includes(status) ? status : "NEW",
    createdAt: getText(item, "createdAt", "created_at") ?? "",
    updatedAt: getText(item, "updatedAt", "updated_at") ?? "",
  };
};
const normalizeDetail = (value: unknown): EnquiryDetail => {
  const item = asRecord(unwrapData(value));
  return {
    ...normalizeEnquiry(item),
    productName: getText(item, "productName", "product_name"),
    productSlug: getText(item, "productSlug", "product_slug"),
    modelNumber: getText(item, "modelNumber", "model_number"),
  };
};
export const enquiryApi = {
  async getEnquiries(filters: EnquiryFilters): Promise<EnquiryListResponse> {
    const { data } = await apiClient.get<unknown>("/admin/enquiries", {
      params: filters,
    });
    const result = asRecord(unwrapData(data));
    const pagination = asRecord(result.pagination);
    return {
      items: Array.isArray(result.items)
        ? result.items.map(normalizeEnquiry)
        : [],
      pagination: {
        page: getNumber(pagination, 1, "page"),
        limit: getNumber(pagination, 20, "limit"),
        total: getNumber(pagination, 0, "total"),
        totalPages: getNumber(pagination, 0, "totalPages"),
      },
    };
  },
  async getEnquiryById(id: number): Promise<EnquiryDetail> {
    const { data } = await apiClient.get<unknown>(`/admin/enquiries/${id}`);
    return normalizeDetail(data);
  },
  async updateEnquiryStatus(
    id: number,
    status: EnquiryStatus,
  ): Promise<EnquiryDetail> {
    const { data } = await apiClient.put<unknown>(
      `/admin/enquiries/${id}/status`,
      { status },
    );
    return normalizeDetail(data);
  },
};
