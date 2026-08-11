import type { CSSProperties } from 'react'
import type { HomeSection } from '../../interfaces/site.interface'
import { getImageUrl } from '../../utils/getImageUrl'
import { ActionLink } from '../common/actionLink'

export const CtaSection = ({ section }: { section: HomeSection }) => {
  const background = getImageUrl(section.backgroundImageUrl); const image = getImageUrl(section.imageUrl)
  const style = background ? { '--section-background': `url("${background}")` } as CSSProperties : undefined
  return <section className={`homeSection ctaSection${background ? ' hasBackground' : ''}`} style={style}><div className="container ctaContent"><div>{section.subtitle && <p className="eyebrow">{section.subtitle}</p>}{section.title && <h2>{section.title}</h2>}{section.description && <p>{section.description}</p>}<ActionLink href={section.buttonLink}>{section.buttonText}</ActionLink></div>{image && <img src={image} alt={section.title ?? ''} loading="lazy" />}</div></section>
}
