import { useParams } from 'react-router-dom'
import { PageShell } from '../components/common/pageShell'
export const BrandPage = () => { const { slug } = useParams(); return <PageShell title="Brand"><p>Browse products from {slug}.</p></PageShell> }
