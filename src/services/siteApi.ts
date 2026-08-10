import type { ContactSettings, HeroContent, SiteContent, SiteSettings, SocialLink, ThemeSettings } from '../interfaces/site.interface'
import { apiClient } from './apiClient'

type JsonRecord = Record<string, unknown>
const record = (value: unknown): JsonRecord => value && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : {}
const text = (source: JsonRecord, ...keys: string[]): string | null => {
  const value = keys.map((key) => source[key]).find((item) => typeof item === 'string')
  return typeof value === 'string' ? value : null
}
const bool = (source: JsonRecord, fallback: boolean, ...keys: string[]): boolean => {
  const value = keys.map((key) => source[key]).find((item) => typeof item === 'boolean' || item === 0 || item === 1)
  return value === undefined ? fallback : Boolean(value)
}

const normalizeSiteContent = (response: unknown): SiteContent => {
  const envelope = record(response)
  const root = record(envelope.data ?? response)
  const settings = record(root.siteSettings ?? root.site_settings ?? root.settings)
  const theme = record(root.themeSettings ?? root.theme_settings ?? root.theme)
  const heroSource = record(root.hero)
  const contact = record(root.contactSettings ?? root.contact_settings ?? root.contact)
  const enquiry = record(root.enquirySettings ?? root.enquiry_settings ?? root.enquiry)
  const socialSource = root.socialMedia ?? root.social_media ?? root.socialLinks ?? []

  const siteSettings: SiteSettings = {
    companyName: text(settings, 'companyName', 'company_name', 'siteName', 'site_name'),
    logo: text(settings, 'logo', 'logoUrl', 'logo_url'),
    footerDescription: text(settings, 'footerDescription', 'footer_description'),
    address: text(settings, 'address'), phone: text(settings, 'phone'), email: text(settings, 'email'),
    copyright: text(settings, 'copyright', 'copyrightText', 'copyright_text'),
  }
  const themeSettings: ThemeSettings = {
    primaryColor: text(theme, 'primaryColor', 'primary_color'), secondaryColor: text(theme, 'secondaryColor', 'secondary_color'),
    backgroundColor: text(theme, 'backgroundColor', 'background_color'), surfaceColor: text(theme, 'surfaceColor', 'surface_color'),
    textColor: text(theme, 'textColor', 'text_color'), mutedTextColor: text(theme, 'mutedTextColor', 'muted_text_color'),
    buttonBackgroundColor: text(theme, 'buttonBackgroundColor', 'button_background_color'), buttonTextColor: text(theme, 'buttonTextColor', 'button_text_color'),
    headerBackgroundColor: text(theme, 'headerBackgroundColor', 'header_background_color'), footerBackgroundColor: text(theme, 'footerBackgroundColor', 'footer_background_color'),
    footerTextColor: text(theme, 'footerTextColor', 'footer_text_color'),
  }
  const contactSettings: ContactSettings = {
    callEnabled: bool(contact, false, 'callEnabled', 'call_enabled'), callPhone: text(contact, 'callPhone', 'call_phone', 'phone'),
    whatsappEnabled: bool(enquiry, bool(contact, false, 'whatsappEnabled', 'whatsapp_enabled'), 'whatsappEnabled', 'whatsapp_enabled'),
    whatsappPhone: text(enquiry, 'whatsappPhone', 'whatsapp_phone', 'phone') ?? text(contact, 'whatsappPhone', 'whatsapp_phone'),
    whatsappDefaultMessage: text(enquiry, 'whatsappDefaultMessage', 'whatsapp_default_message', 'defaultMessage', 'default_message') ?? text(contact, 'whatsappDefaultMessage', 'whatsapp_default_message'),
  }
  const hero: HeroContent | null = Object.keys(heroSource).length ? {
    title: text(heroSource, 'title'), subtitle: text(heroSource, 'subtitle'), description: text(heroSource, 'description'),
    backgroundImage: text(heroSource, 'backgroundImage', 'background_image'), foregroundImage: text(heroSource, 'foregroundImage', 'foreground_image', 'image'),
    primaryButtonText: text(heroSource, 'primaryButtonText', 'primary_button_text'), primaryButtonUrl: text(heroSource, 'primaryButtonUrl', 'primary_button_url'),
    secondaryButtonText: text(heroSource, 'secondaryButtonText', 'secondary_button_text'), secondaryButtonUrl: text(heroSource, 'secondaryButtonUrl', 'secondary_button_url'),
    isVisible: bool(heroSource, true, 'isVisible', 'is_visible'),
  } : null
  const socialMedia: SocialLink[] = Array.isArray(socialSource) ? socialSource.map(record).map((item) => ({
    id: typeof item.id === 'string' || typeof item.id === 'number' ? item.id : undefined,
    platform: text(item, 'platform', 'name') ?? '', url: text(item, 'url', 'link') ?? '', isActive: bool(item, true, 'isActive', 'is_active'),
  })).filter((item) => item.platform && item.url) : []

  return { siteSettings, themeSettings, hero, contactSettings, socialMedia }
}

export const siteApi = {
  async getSiteContent(): Promise<SiteContent> {
    const response = await apiClient.get<unknown>('/site-content')
    return normalizeSiteContent(response.data)
  },
}
