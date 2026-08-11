import type {
  ProductEnquiryRequest,
  ProductEnquiryResponse,
} from "../interfaces/enquiry.interface";
import { apiClient } from "./apiClient";
import { asRecord, getId, getText, unwrapData } from "./responseNormalizers";

export const enquiryApi = {
  async createEnquiry(
    payload: ProductEnquiryRequest,
  ): Promise<ProductEnquiryResponse> {
    const { data } = await apiClient.post<unknown>("/enquiries", payload);
    const result = asRecord(unwrapData(data));
    return {
      id: getId(result),
      message: getText(result, "message") ?? undefined,
    };
  },
};
