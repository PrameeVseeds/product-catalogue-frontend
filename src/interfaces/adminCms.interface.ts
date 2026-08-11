import type { HomeSectionType } from "./site.interface";

export type TextAlignment = "LEFT" | "CENTER" | "RIGHT";
export type UploadType =
  | "general"
  | "hero"
  | "section"
  | "category"
  | "brand"
  | "subcategory"
  | "product"
  | "contact";

export interface SiteSettingsForm {
  companyName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  websiteTitle: string | null;
  websiteDescription: string | null;
  footerDescription: string | null;
  copyrightText: string | null;
  isMaintenanceMode: boolean;
}
export interface ThemeSettingsForm {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  headerBackgroundColor: string;
  footerBackgroundColor: string;
  footerTextColor: string;
}
export interface HeroSettingsForm {
  title: string;
  subtitle: string | null;
  description: string | null;
  backgroundImageUrl: string | null;
  foregroundImageUrl: string | null;
  primaryButtonText: string | null;
  primaryButtonLink: string | null;
  secondaryButtonText: string | null;
  secondaryButtonLink: string | null;
  textAlignment: TextAlignment;
  overlayOpacity: number;
  isVisible: boolean;
}
export interface ContactSettingsForm {
  contactHeading: string;
  contactDescription: string | null;
  companyName: string | null;
  address: string | null;
  phonePrimary: string | null;
  phoneSecondary: string | null;
  fax: string | null;
  generalEmail: string | null;
  workingHours: string | null;
  mapEmbedUrl: string | null;
  contactBackgroundImageUrl: string | null;
}
export interface EnquirySettingsForm {
  callEnabled: boolean;
  callButtonText: string;
  callPhone: string | null;
  whatsappEnabled: boolean;
  whatsappButtonText: string;
  whatsappNumber: string | null;
  whatsappDefaultMessage: string | null;
  emailEnabled: boolean;
  emailButtonText: string;
  enquiryEmail: string | null;
  defaultEmailSubject: string | null;
}
export interface HomeSectionForm {
  sectionKey: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  imageUrl: string | null;
  backgroundImageUrl: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  sectionType: HomeSectionType;
  displayOrder: number;
  isVisible: boolean;
}
export interface HomeSectionItemForm {
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string | null;
  iconName: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  displayOrder: number;
  isVisible: boolean;
}
export interface AdminHomeSection extends HomeSectionForm {
  id: number;
  items: AdminHomeSectionItem[];
}
export interface AdminHomeSectionItem extends HomeSectionItemForm {
  id: number;
  sectionId: number;
}
export interface SocialMediaForm {
  platform: string;
  displayName: string | null;
  profileUrl: string;
  iconName: string | null;
  displayOrder: number;
  isActive: boolean;
}
export interface AdminSocialMedia extends SocialMediaForm {
  id: number;
}
