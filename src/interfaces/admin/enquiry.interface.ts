export type EnquiryType = "GENERAL" | "PRODUCT";
export type EnquiryStatus = "NEW" | "IN_PROGRESS" | "CONTACTED" | "CLOSED";
export interface Enquiry {
  id: number;
  productId: number | null;
  enquiryType: EnquiryType;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}
export interface EnquiryDetail extends Enquiry {
  productName: string | null;
  productSlug: string | null;
  modelNumber: string | null;
}
export interface EnquiryFilters {
  status?: EnquiryStatus;
  enquiryType?: EnquiryType;
  productId?: number;
  page?: number;
  limit?: number;
}
export interface EnquiryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface EnquiryListResponse {
  items: Enquiry[];
  pagination: EnquiryPagination;
}
