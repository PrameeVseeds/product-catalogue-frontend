export interface SiteSettings {
  companyName?: string | null
  logo?: string | null
  footerDescription?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  copyright?: string | null
}

export interface ThemeSettings {
  primaryColor?: string | null
  secondaryColor?: string | null
  backgroundColor?: string | null
  surfaceColor?: string | null
  textColor?: string | null
  mutedTextColor?: string | null
  buttonBackgroundColor?: string | null
  buttonTextColor?: string | null
  headerBackgroundColor?: string | null
  footerBackgroundColor?: string | null
  footerTextColor?: string | null
}

export interface HeroContent {
  title?: string | null
  subtitle?: string | null
  description?: string | null
  backgroundImage?: string | null
  foregroundImage?: string | null
  primaryButtonText?: string | null
  primaryButtonUrl?: string | null
  secondaryButtonText?: string | null
  secondaryButtonUrl?: string | null
  isVisible: boolean
}

export interface ContactSettings {
  callEnabled: boolean
  callPhone?: string | null
  whatsappEnabled: boolean
  whatsappPhone?: string | null
  whatsappDefaultMessage?: string | null
}

export interface SocialLink {
  id?: string | number
  platform: string
  url: string
  isActive: boolean
}

export interface SiteContent {
  siteSettings: SiteSettings
  themeSettings: ThemeSettings
  hero: HeroContent | null
  contactSettings: ContactSettings
  socialMedia: SocialLink[]
}
