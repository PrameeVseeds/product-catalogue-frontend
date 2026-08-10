import { Link } from 'react-router-dom'
import type { ProductSummary } from '../../interfaces/product.interface'
import { getImageUrl } from '../../utils/getImageUrl'

export const ProductCard = ({ product }: { product: ProductSummary }) => {
  const image = getImageUrl(product.mainImageUrl)
  return <article className="catalogueCard productCard">{image && <Link to={`/products/${encodeURIComponent(product.slug)}`}><img src={image} alt={product.name} loading="lazy" /></Link>}<div className="cardBody">
    {product.brand?.name && <p className="cardMeta">{product.brand.name}</p>}
    <h3><Link to={`/products/${encodeURIComponent(product.slug)}`}>{product.name}
    </Link></h3>{product.modelNumber && <p className="modelNumber">{product.modelNumber}</p>}
    {product.shortDescription && <p>{product.shortDescription}</p>}
    <Link className="textLink" to={`/products/${encodeURIComponent(product.slug)}`}>View Details</Link>
  </div></article>
}
