export interface ProductEnquiryRequest {
  productId?: string | number;
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
