import { ErrorMessage } from '../components/common/errorMessage'
import { LoadingSpinner } from '../components/common/loadingSpinner'
import { useSiteContent } from '../hooks/useSiteContent'
import { getImageUrl } from '../utils/getImageUrl'

const isSafeLink = (value?: string | null): value is string => Boolean(value && (/^(https?:\/\/|\/|#)/.test(value)))

export const HomePage = () => {
  const { data, loading, error } = useSiteContent()
  if (loading) return <div className="container stateSection"><LoadingSpinner /></div>
  if (error) return <div className="container stateSection"><ErrorMessage message={error} /></div>
  const hero = data?.hero
  if (!hero?.isVisible) return <section className="container pageSection" aria-label="Home" />
  const background = getImageUrl(hero.backgroundImage)
  const foreground = getImageUrl(hero.foregroundImage)
  return <section className="heroSection" style={background ? { backgroundImage: `linear-gradient(rgb(0 0 0 / 45%), rgb(0 0 0 / 45%)), url("${background}")` } : undefined}>
    <div className="container heroContent"><div className="heroCopy">
      {hero.subtitle && <p className="eyebrow">{hero.subtitle}</p>}{hero.title && <h1>{hero.title}</h1>}{hero.description && <p>{hero.description}</p>}
      <div className="heroActions">
        {hero.primaryButtonText && isSafeLink(hero.primaryButtonUrl) && <a className="button" href={hero.primaryButtonUrl}>{hero.primaryButtonText}</a>}
        {hero.secondaryButtonText && isSafeLink(hero.secondaryButtonUrl) && <a className="button buttonSecondary" href={hero.secondaryButtonUrl}>{hero.secondaryButtonText}</a>}
      </div>
    </div>{foreground && <img className="heroImage" src={foreground} alt="" />}</div>
  </section>
}
