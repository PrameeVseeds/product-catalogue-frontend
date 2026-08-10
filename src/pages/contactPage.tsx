import { ErrorMessage } from '../components/common/errorMessage'
import { LoadingSpinner } from '../components/common/loadingSpinner'
import { PageShell } from '../components/common/pageShell'
import { useSiteContent } from '../hooks/useSiteContent'
export const ContactPage = () => { const { data, loading, error } = useSiteContent(); return <PageShell title="Contact Us">{loading && <LoadingSpinner />}{error && <ErrorMessage message={error} />}{data?.siteSettings.address && <p>{data.siteSettings.address}</p>}{data?.siteSettings.phone && <p><a href={`tel:${data.siteSettings.phone.replace(/[^+\d]/g, '')}`}>{data.siteSettings.phone}</a></p>}{data?.siteSettings.email && <p><a href={`mailto:${data.siteSettings.email}`}>{data.siteSettings.email}</a></p>}</PageShell> }
