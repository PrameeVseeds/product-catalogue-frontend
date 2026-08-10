import type {
  AdminHomeSection,
  AdminHomeSectionItem,
  AdminSocialMedia,
  ContactSettingsForm,
  EnquirySettingsForm,
  HeroSettingsForm,
  HomeSectionForm,
  HomeSectionItemForm,
  SiteSettingsForm,
  ThemeSettingsForm,
} from "../../interfaces/adminCms.interface";
import type { HomeSectionType } from "../../interfaces/site.interface";
import {
  asArray,
  asRecord,
  getBoolean,
  getId,
  getNumber,
  getText,
  unwrapData,
  type JsonRecord,
} from "../responseNormalizers";

const nullable = (source: JsonRecord, camel: string, snake: string) =>
  getText(source, camel, snake);
export const normalizeSiteSettings = (value: unknown): SiteSettingsForm => {
  const s = asRecord(unwrapData(value));
  return {
    companyName: nullable(s, "companyName", "company_name") ?? "",
    logoUrl: nullable(s, "logoUrl", "logo_url"),
    faviconUrl: nullable(s, "faviconUrl", "favicon_url"),
    websiteTitle: nullable(s, "websiteTitle", "website_title"),
    websiteDescription: nullable(
      s,
      "websiteDescription",
      "website_description",
    ),
    footerDescription: nullable(s, "footerDescription", "footer_description"),
    copyrightText: nullable(s, "copyrightText", "copyright_text"),
    isMaintenanceMode: getBoolean(
      s,
      false,
      "isMaintenanceMode",
      "is_maintenance_mode",
    ),
  };
};
export const normalizeThemeSettings = (value: unknown): ThemeSettingsForm => {
  const s = asRecord(unwrapData(value));
  return {
    primaryColor: nullable(s, "primaryColor", "primary_color") ?? "",
    secondaryColor: nullable(s, "secondaryColor", "secondary_color") ?? "",
    backgroundColor: nullable(s, "backgroundColor", "background_color") ?? "",
    surfaceColor: nullable(s, "surfaceColor", "surface_color") ?? "",
    textColor: nullable(s, "textColor", "text_color") ?? "",
    mutedTextColor: nullable(s, "mutedTextColor", "muted_text_color") ?? "",
    buttonBackgroundColor:
      nullable(s, "buttonBackgroundColor", "button_background_color") ?? "",
    buttonTextColor: nullable(s, "buttonTextColor", "button_text_color") ?? "",
    headerBackgroundColor:
      nullable(s, "headerBackgroundColor", "header_background_color") ?? "",
    footerBackgroundColor:
      nullable(s, "footerBackgroundColor", "footer_background_color") ?? "",
    footerTextColor: nullable(s, "footerTextColor", "footer_text_color") ?? "",
  };
};
export const normalizeHeroSettings = (value: unknown): HeroSettingsForm => {
  const s = asRecord(unwrapData(value));
  const alignment = nullable(s, "textAlignment", "text_alignment");
  return {
    title: getText(s, "title") ?? "",
    subtitle: getText(s, "subtitle"),
    description: getText(s, "description"),
    backgroundImageUrl: nullable(
      s,
      "backgroundImageUrl",
      "background_image_url",
    ),
    foregroundImageUrl: nullable(
      s,
      "foregroundImageUrl",
      "foreground_image_url",
    ),
    primaryButtonText: nullable(s, "primaryButtonText", "primary_button_text"),
    primaryButtonLink: nullable(s, "primaryButtonLink", "primary_button_link"),
    secondaryButtonText: nullable(
      s,
      "secondaryButtonText",
      "secondary_button_text",
    ),
    secondaryButtonLink: nullable(
      s,
      "secondaryButtonLink",
      "secondary_button_link",
    ),
    textAlignment:
      alignment === "CENTER" || alignment === "RIGHT" ? alignment : "LEFT",
    overlayOpacity: getNumber(s, 0.45, "overlayOpacity", "overlay_opacity"),
    isVisible: getBoolean(s, true, "isVisible", "is_visible"),
  };
};
export const normalizeContactSettings = (
  value: unknown,
): ContactSettingsForm => {
  const s = asRecord(unwrapData(value));
  return {
    contactHeading: nullable(s, "contactHeading", "contact_heading") ?? "",
    contactDescription: nullable(
      s,
      "contactDescription",
      "contact_description",
    ),
    companyName: nullable(s, "companyName", "company_name"),
    address: getText(s, "address"),
    phonePrimary: nullable(s, "phonePrimary", "phone_primary"),
    phoneSecondary: nullable(s, "phoneSecondary", "phone_secondary"),
    fax: getText(s, "fax"),
    generalEmail: nullable(s, "generalEmail", "general_email"),
    workingHours: nullable(s, "workingHours", "working_hours"),
    mapEmbedUrl: nullable(s, "mapEmbedUrl", "map_embed_url"),
    contactBackgroundImageUrl: nullable(
      s,
      "contactBackgroundImageUrl",
      "contact_background_image_url",
    ),
  };
};
export const normalizeEnquirySettings = (
  value: unknown,
): EnquirySettingsForm => {
  const s = asRecord(unwrapData(value));
  return {
    callEnabled: getBoolean(s, true, "callEnabled", "call_enabled"),
    callButtonText: nullable(s, "callButtonText", "call_button_text") ?? "",
    callPhone: nullable(s, "callPhone", "call_phone"),
    whatsappEnabled: getBoolean(s, true, "whatsappEnabled", "whatsapp_enabled"),
    whatsappButtonText:
      nullable(s, "whatsappButtonText", "whatsapp_button_text") ?? "",
    whatsappNumber: nullable(s, "whatsappNumber", "whatsapp_number"),
    whatsappDefaultMessage: nullable(
      s,
      "whatsappDefaultMessage",
      "whatsapp_default_message",
    ),
    emailEnabled: getBoolean(s, true, "emailEnabled", "email_enabled"),
    emailButtonText: nullable(s, "emailButtonText", "email_button_text") ?? "",
    enquiryEmail: nullable(s, "enquiryEmail", "enquiry_email"),
    defaultEmailSubject: nullable(
      s,
      "defaultEmailSubject",
      "default_email_subject",
    ),
  };
};

export const normalizeSectionItem = (value: unknown): AdminHomeSectionItem => {
  const s = asRecord(value);
  return {
    id: Number(getId(s)),
    sectionId: getNumber(s, 0, "sectionId", "section_id"),
    title: getText(s, "title") ?? "",
    subtitle: getText(s, "subtitle"),
    description: getText(s, "description"),
    imageUrl: nullable(s, "imageUrl", "image_url"),
    iconName: nullable(s, "iconName", "icon_name"),
    buttonText: nullable(s, "buttonText", "button_text"),
    buttonLink: nullable(s, "buttonLink", "button_link"),
    displayOrder: getNumber(s, 0, "displayOrder", "display_order"),
    isVisible: getBoolean(s, true, "isVisible", "is_visible"),
  };
};
export const normalizeHomeSection = (value: unknown): AdminHomeSection => {
  const s = asRecord(value);
  const type = nullable(s, "sectionType", "section_type") as HomeSectionType;
  return {
    id: Number(getId(s)),
    sectionKey: nullable(s, "sectionKey", "section_key") ?? "",
    title: getText(s, "title"),
    subtitle: getText(s, "subtitle"),
    description: getText(s, "description"),
    imageUrl: nullable(s, "imageUrl", "image_url"),
    backgroundImageUrl: nullable(
      s,
      "backgroundImageUrl",
      "background_image_url",
    ),
    buttonText: nullable(s, "buttonText", "button_text"),
    buttonLink: nullable(s, "buttonLink", "button_link"),
    sectionType: type,
    displayOrder: getNumber(s, 0, "displayOrder", "display_order"),
    isVisible: getBoolean(s, true, "isVisible", "is_visible"),
    items: Array.isArray(s.items) ? s.items.map(normalizeSectionItem) : [],
  };
};
export const normalizeHomeSections = (value: unknown) =>
  asArray(value)
    .map(normalizeHomeSection)
    .sort((a, b) => a.displayOrder - b.displayOrder);
export const normalizeSocialMedia = (value: unknown): AdminSocialMedia[] =>
  asArray(value)
    .map((s) => ({
      id: Number(getId(s)),
      platform: getText(s, "platform") ?? "",
      displayName: nullable(s, "displayName", "display_name"),
      profileUrl: nullable(s, "profileUrl", "profile_url") ?? "",
      iconName: nullable(s, "iconName", "icon_name"),
      displayOrder: getNumber(s, 0, "displayOrder", "display_order"),
      isActive: getBoolean(s, true, "isActive", "is_active"),
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder);
export type { HomeSectionForm, HomeSectionItemForm };
