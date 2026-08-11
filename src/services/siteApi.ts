import type {
  HeroContent,
  HomeSection,
  HomeSectionItem,
  HomeSectionType,
  SiteContent,
  SocialLink,
} from "../interfaces/site.interface";
import { apiClient } from "./apiClient";
import {
  asRecord,
  getBoolean,
  getId,
  getNumber,
  getText,
  unwrapData,
} from "./responseNormalizers";

const sectionTypes: HomeSectionType[] = [
  "CONTENT",
  "CARDS",
  "CATEGORIES",
  "FEATURED_PRODUCTS",
  "BRANDS",
  "CTA",
];

const normalizeItem = (value: unknown): HomeSectionItem => {
  const item = asRecord(value);
  return {
    id: getId(item),
    title: getText(item, "title") ?? "",
    subtitle: getText(item, "subtitle"),
    description: getText(item, "description"),
    imageUrl: getText(item, "imageUrl", "image_url"),
    iconName: getText(item, "iconName", "icon_name"),
    buttonText: getText(item, "buttonText", "button_text"),
    buttonLink: getText(item, "buttonLink", "button_link"),
    displayOrder: getNumber(item, 0, "displayOrder", "display_order"),
    isVisible: getBoolean(item, true, "isVisible", "is_visible"),
  };
};

const normalizeSection = (value: unknown): HomeSection | null => {
  const section = asRecord(value);
  const type = getText(
    section,
    "sectionType",
    "section_type",
  ) as HomeSectionType | null;
  if (!type || !sectionTypes.includes(type)) return null;
  const itemsSource = section.items;
  return {
    id: getId(section),
    sectionKey:
      getText(section, "sectionKey", "section_key") ?? String(getId(section)),
    title: getText(section, "title"),
    subtitle: getText(section, "subtitle"),
    description: getText(section, "description"),
    imageUrl: getText(section, "imageUrl", "image_url"),
    backgroundImageUrl: getText(
      section,
      "backgroundImageUrl",
      "background_image_url",
    ),
    buttonText: getText(section, "buttonText", "button_text"),
    buttonLink: getText(section, "buttonLink", "button_link"),
    sectionType: type,
    displayOrder: getNumber(section, 0, "displayOrder", "display_order"),
    isVisible: getBoolean(section, true, "isVisible", "is_visible"),
    items: Array.isArray(itemsSource)
      ? itemsSource
          .map(normalizeItem)
          .filter((item) => item.isVisible)
          .sort((a, b) => a.displayOrder - b.displayOrder)
      : [],
  };
};

const normalizeSiteContent = (response: unknown): SiteContent => {
  const root = asRecord(unwrapData(response));
  const settings = asRecord(root.siteSettings ?? root.site_settings);
  const theme = asRecord(root.themeSettings ?? root.theme_settings);
  const heroSource = asRecord(root.hero);
  const contact = asRecord(root.contactSettings ?? root.contact_settings);
  const enquiry = asRecord(root.enquirySettings ?? root.enquiry_settings);
  const socialSource = root.socialMedia ?? root.social_media;
  const sectionsSource = root.homeSections ?? root.home_sections;

  const alignment = getText(heroSource, "textAlignment", "text_alignment");
  const hero: HeroContent | null = Object.keys(heroSource).length
    ? {
        title: getText(heroSource, "title"),
        subtitle: getText(heroSource, "subtitle"),
        description: getText(heroSource, "description"),
        backgroundImage: getText(
          heroSource,
          "backgroundImageUrl",
          "background_image_url",
          "backgroundImage",
          "background_image",
        ),
        foregroundImage: getText(
          heroSource,
          "foregroundImageUrl",
          "foreground_image_url",
          "foregroundImage",
          "foreground_image",
        ),
        primaryButtonText: getText(
          heroSource,
          "primaryButtonText",
          "primary_button_text",
        ),
        primaryButtonUrl: getText(
          heroSource,
          "primaryButtonLink",
          "primary_button_link",
          "primaryButtonUrl",
        ),
        secondaryButtonText: getText(
          heroSource,
          "secondaryButtonText",
          "secondary_button_text",
        ),
        secondaryButtonUrl: getText(
          heroSource,
          "secondaryButtonLink",
          "secondary_button_link",
          "secondaryButtonUrl",
        ),
        textAlignment:
          alignment === "CENTER" || alignment === "RIGHT" ? alignment : "LEFT",
        overlayOpacity: Math.min(
          1,
          Math.max(
            0,
            getNumber(heroSource, 0.45, "overlayOpacity", "overlay_opacity"),
          ),
        ),
        isVisible: getBoolean(heroSource, true, "isVisible", "is_visible"),
      }
    : null;

  const socialMedia: SocialLink[] = Array.isArray(socialSource)
    ? socialSource
        .map(asRecord)
        .map((item) => ({
          id: getId(item),
          platform: getText(item, "platform") ?? "",
          displayName: getText(item, "displayName", "display_name"),
          url: getText(item, "profileUrl", "profile_url", "url") ?? "",
          isActive: getBoolean(item, true, "isActive", "is_active"),
          displayOrder: getNumber(item, 0, "displayOrder", "display_order"),
        }))
        .filter((item) => item.platform && item.url)
        .sort((a, b) => a.displayOrder - b.displayOrder)
    : [];
  const homeSections = (
    Array.isArray(sectionsSource) ? sectionsSource.map(normalizeSection) : []
  )
    .filter((section): section is HomeSection => Boolean(section?.isVisible))
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return {
    siteSettings: {
      companyName: getText(settings, "companyName", "company_name"),
      logo: getText(settings, "logoUrl", "logo_url", "logo"),
      footerDescription: getText(
        settings,
        "footerDescription",
        "footer_description",
      ),
      address: getText(contact, "address"),
      phone: getText(contact, "phonePrimary", "phone_primary"),
      email: getText(contact, "generalEmail", "general_email"),
      copyright: getText(
        settings,
        "copyrightText",
        "copyright_text",
        "copyright",
      ),
    },
    themeSettings: {
      primaryColor: getText(theme, "primaryColor", "primary_color"),
      secondaryColor: getText(theme, "secondaryColor", "secondary_color"),
      backgroundColor: getText(theme, "backgroundColor", "background_color"),
      surfaceColor: getText(theme, "surfaceColor", "surface_color"),
      textColor: getText(theme, "textColor", "text_color"),
      mutedTextColor: getText(theme, "mutedTextColor", "muted_text_color"),
      buttonBackgroundColor: getText(
        theme,
        "buttonBackgroundColor",
        "button_background_color",
      ),
      buttonTextColor: getText(theme, "buttonTextColor", "button_text_color"),
      headerBackgroundColor: getText(
        theme,
        "headerBackgroundColor",
        "header_background_color",
      ),
      footerBackgroundColor: getText(
        theme,
        "footerBackgroundColor",
        "footer_background_color",
      ),
      footerTextColor: getText(theme, "footerTextColor", "footer_text_color"),
    },
    hero,
    contactSettings: {
      callEnabled: getBoolean(enquiry, false, "callEnabled", "call_enabled"),
      callButtonText: getText(enquiry, "callButtonText", "call_button_text"),
      callPhone: getText(enquiry, "callPhone", "call_phone"),
      whatsappEnabled: getBoolean(
        enquiry,
        false,
        "whatsappEnabled",
        "whatsapp_enabled",
      ),
      whatsappPhone: getText(enquiry, "whatsappNumber", "whatsapp_number"),
      whatsappButtonText: getText(
        enquiry,
        "whatsappButtonText",
        "whatsapp_button_text",
      ),
      whatsappDefaultMessage: getText(
        enquiry,
        "whatsappDefaultMessage",
        "whatsapp_default_message",
      ),
      emailEnabled: getBoolean(enquiry, false, "emailEnabled", "email_enabled"),
      emailButtonText: getText(enquiry, "emailButtonText", "email_button_text"),
      enquiryEmail: getText(enquiry, "enquiryEmail", "enquiry_email"),
      defaultEmailSubject: getText(
        enquiry,
        "defaultEmailSubject",
        "default_email_subject",
      ),
    },
    contactDetails: {
      heading: getText(contact, "contactHeading", "contact_heading"),
      description: getText(
        contact,
        "contactDescription",
        "contact_description",
      ),
      companyName: getText(contact, "companyName", "company_name"),
      address: getText(contact, "address"),
      phonePrimary: getText(contact, "phonePrimary", "phone_primary"),
      phoneSecondary: getText(contact, "phoneSecondary", "phone_secondary"),
      fax: getText(contact, "fax"),
      generalEmail: getText(contact, "generalEmail", "general_email"),
      workingHours: getText(contact, "workingHours", "working_hours"),
      mapEmbedUrl: getText(contact, "mapEmbedUrl", "map_embed_url"),
      backgroundImageUrl: getText(
        contact,
        "contactBackgroundImageUrl",
        "contact_background_image_url",
      ),
    },
    socialMedia,
    homeSections,
  };
};

export const siteApi = {
  async getSiteContent(): Promise<SiteContent> {
    const { data } = await apiClient.get<unknown>("/site-content");
    return normalizeSiteContent(data);
  },
};
