import type { HomeSection } from '../../interfaces/site.interface'
import { getImageUrl } from '../../utils/getImageUrl'
import { ActionLink } from '../common/actionLink'
import { SectionHeading } from './sectionHeading'

export const ContentSection = ({ section, index }: { section: HomeSection; index: number }) => {
  const image = getImageUrl(section.imageUrl)
  return <section className="homeSection"><div className={`container contentSection${index % 2 ? ' contentReversed' : ''}`}><div><SectionHeading title={section.title} subtitle={section.subtitle} description={section.description} /><ActionLink href={section.buttonLink}>{section.buttonText}</ActionLink></div>{image && <img src={image} alt={section.title ?? ''} loading="lazy" />}</div></section>
}
