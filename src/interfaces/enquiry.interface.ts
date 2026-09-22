export interface ProductEnquiryRequest {
  productId?: string | number;
  modelNumber?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}

export interface ProductEnquiryResponse {
  id?: string | number;
  message?: string;
}
