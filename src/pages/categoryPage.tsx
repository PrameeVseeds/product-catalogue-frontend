import { useParams } from 'react-router-dom'
import { PageShell } from '../components/common/pageShell'
export const CategoryPage = () => { const { slug } = useParams(); return <PageShell title="Category"><p>Browse products in {slug}.</p></PageShell> }
