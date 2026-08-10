import { createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from '../layouts/publicLayout'
import { BrandPage } from '../pages/brandPage'
import { CategoryPage } from '../pages/categoryPage'
import { ContactPage } from '../pages/contactPage'
import { HomePage } from '../pages/homePage'
import { NotFoundPage } from '../pages/notFoundPage'
import { ProductDetailsPage } from '../pages/productDetailsPage'
import { ProductsPage } from '../pages/productsPage'
import { SubcategoryPage } from '../pages/subcategoryPage'

export const appRouter = createBrowserRouter([{
  element: <PublicLayout />,
  children: [
    { path: '/', element: <HomePage /> }, { path: '/products', element: <ProductsPage /> },
    { path: '/categories/:slug', element: <CategoryPage /> }, { path: '/brands/:slug', element: <BrandPage /> },
    { path: '/subcategories/:slug', element: <SubcategoryPage /> }, { path: '/products/:slug', element: <ProductDetailsPage /> },
    { path: '/contact', element: <ContactPage /> }, { path: '*', element: <NotFoundPage /> },
  ],
}])
