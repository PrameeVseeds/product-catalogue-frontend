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
  textAlignment: 'LEFT' | 'CENTER' | 'RIGHT'
  overlayOpacity: number
  isVisible: boolean
}

export type HomeSectionType = 'CONTENT' | 'CARDS' | 'CATEGORIES' | 'FEATURED_PRODUCTS' | 'BRANDS' | 'CTA'

export interface HomeSectionItem {
  id: string | number
  title: string
  subtitle?: string | null
  description?: string | null
  imageUrl?: string | null
  iconName?: string | null
  buttonText?: string | null
  buttonLink?: string | null
  displayOrder: number
  isVisible: boolean
}

export interface HomeSection {
  id: string | number
  sectionKey: string
  title?: string | null
  subtitle?: string | null
  description?: string | null
  imageUrl?: string | null
  backgroundImageUrl?: string | null
  buttonText?: string | null
  buttonLink?: string | null
  sectionType: HomeSectionType
  displayOrder: number
  isVisible: boolean
  items: HomeSectionItem[]
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
  homeSections: HomeSection[]
}
