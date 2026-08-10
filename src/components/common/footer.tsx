import { useSiteContent } from '../../hooks/useSiteContent'

const safeExternalUrl = (value: string): string => {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.href : '' } catch { return '' }
}

export const Footer = () => {
  const { data } = useSiteContent()
  const site = data?.siteSettings
  const links = data?.socialMedia.filter((link) => link.isActive && safeExternalUrl(link.url)) ?? []
  const hasDetails = site?.address || site?.phone || site?.email
  if (!site?.companyName && !site?.footerDescription && !hasDetails && !links.length && !site?.copyright) return null

  return <footer className="siteFooter"><div className="container footerGrid">
    <div>{site?.companyName && <h2>{site.companyName}</h2>}{site?.footerDescription && <p>{site.footerDescription}</p>}</div>
    {hasDetails && <address>
      {site?.address && <span>{site.address}</span>}
      {site?.phone && <a href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}>{site.phone}</a>}
      {site?.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
    </address>}
    {links.length > 0 && <div className="socialLinks" aria-label="Social media">{links.map((link) => <a key={link.id ?? `${link.platform}-${link.url}`} href={safeExternalUrl(link.url)} target="_blank" rel="noopener noreferrer">{link.platform}</a>)}</div>}
  </div>{site?.copyright && <div className="container copyright">{site.copyright}</div>}</footer>
}
