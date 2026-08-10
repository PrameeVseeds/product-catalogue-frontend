import { useParams } from 'react-router-dom'
import { PageShell } from '../components/common/pageShell'
export const SubcategoryPage = () => { const { slug } = useParams(); return <PageShell title="Subcategory"><p>Browse products in {slug}.</p></PageShell> }
