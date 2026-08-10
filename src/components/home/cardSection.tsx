import type { HomeSection } from '../../interfaces/site.interface'
import { getImageUrl } from '../../utils/getImageUrl'
import { ActionLink } from '../common/actionLink'
import { SectionHeading } from './sectionHeading'

export const CardSection = ({ section }: { section: HomeSection }) => <section className="homeSection surfaceSection"><div className="container"><SectionHeading title={section.title} subtitle={section.subtitle} description={section.description} /><div className="cardGrid">{section.items.map((item) => { const image = getImageUrl(item.imageUrl); return <article className="catalogueCard" key={item.id}>{image && <img src={image} alt={item.title} loading="lazy" />}<div className="cardBody">{item.iconName && <span className="itemIcon" aria-hidden="true">{item.iconName}</span>}{item.subtitle && <p className="cardMeta">{item.subtitle}</p>}<h3>{item.title}</h3>{item.description && <p>{item.description}</p>}<ActionLink className="textLink" href={item.buttonLink}>{item.buttonText}</ActionLink></div></article> })}</div></div></section>
