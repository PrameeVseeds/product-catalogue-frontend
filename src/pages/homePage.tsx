import { ErrorMessage } from '../components/common/errorMessage'
import { LoadingSpinner } from '../components/common/loadingSpinner'
import { DynamicHomeSection } from '../components/home/dynamicHomeSection'
import { HeroSection } from '../components/home/heroSection'
import { useHomeCatalogue } from '../hooks/useHomeCatalogue'
import { useSiteContent } from '../hooks/useSiteContent'

export const HomePage = () => {
  const site = useSiteContent(); const catalogue = useHomeCatalogue()
  if (site.loading) return <div className="container stateSection"><LoadingSpinner /></div>
  if (site.error || !site.data) return <div className="container stateSection"><ErrorMessage message={site.error ?? 'Unable to load the website content.'} /></div>
  return <><HeroSection hero={site.data.hero} />
  {catalogue.loading && <div className="container catalogueLoading">
    <LoadingSpinner /></div>}{site.data.homeSections.map((section, index) => <DynamicHomeSection key={section.id || section.sectionKey} 
    section={section} index={index} categories={catalogue.data.categories} 
    products={catalogue.data.featuredProducts} brands={catalogue.data.brands} 
    errors={catalogue.errors} />)}</>
}
