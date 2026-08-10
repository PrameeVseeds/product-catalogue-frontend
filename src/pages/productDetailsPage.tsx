import { useParams } from 'react-router-dom'
import { PageShell } from '../components/common/pageShell'
export const ProductDetailsPage = () => { const { slug } = useParams(); return <PageShell title="Product Details"><p>Product: {slug}</p></PageShell> }
