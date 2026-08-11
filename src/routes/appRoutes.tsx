import { createBrowserRouter } from "react-router-dom";
import {
  ProtectedRoute,
  AdminLoginRoute,
} from "../components/admin/protectedRoute";
import { AdminLayout } from "../layouts/adminLayout";
import { PublicLayout } from "../layouts/publicLayout";
import { BrandPage } from "../pages/brandPage";
import { CategoryPage } from "../pages/categoryPage";
import { ContactPage } from "../pages/contactPage";
import { HomePage } from "../pages/homePage";
import { NotFoundPage } from "../pages/notFoundPage";
import { ProductDetailsPage } from "../pages/productDetailsPage";
import { ProductsPage } from "../pages/productsPage";
import { SubcategoryPage } from "../pages/subcategoryPage";
import { AdminDashboardPage } from "../pages/admin/adminDashboardPage";
import { AdminLoginPage } from "../pages/admin/adminLoginPage";
import { AdminPlaceholderPage } from "../pages/admin/adminPlaceholderPage";
import { ContactSettingsPage } from "../pages/admin/contactSettingsPage";
import { EnquirySettingsPage } from "../pages/admin/enquirySettingsPage";
import { HeroSettingsPage } from "../pages/admin/heroSettingsPage";
import { HomeSectionsPage } from "../pages/admin/homeSectionsPage";
import { SiteSettingsPage } from "../pages/admin/siteSettingsPage";
import { SocialMediaPage } from "../pages/admin/socialMediaPage";
import { ThemeSettingsPage } from "../pages/admin/themeSettingsPage";
import { BrandsPage } from "../pages/admin/brandsPage";
import { CategoriesPage } from "../pages/admin/categoriesPage";
import { CategoryBrandsPage } from "../pages/admin/categoryBrandsPage";
import { ProductManagementPage } from "../pages/admin/productManagementPage";
import { ProductsAdminPage } from "../pages/admin/productsPage";
import { SubcategoriesPage } from "../pages/admin/subcategoriesPage";
import { EnquiriesPage } from "../pages/admin/enquiriesPage";
import { EnquiryDetailsPage } from "../pages/admin/enquiryDetailsPage";

export const appRouter = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/categories/:slug", element: <CategoryPage /> },
      { path: "/brands/:slug", element: <BrandPage /> },
      { path: "/subcategories/:slug", element: <SubcategoryPage /> },
      { path: "/products/:slug", element: <ProductDetailsPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    element: <AdminLoginRoute />,
    children: [{ path: "/admin/login", element: <AdminLoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "site-settings", element: <SiteSettingsPage /> },
          { path: "theme", element: <ThemeSettingsPage /> },
          { path: "hero", element: <HeroSettingsPage /> },
          { path: "home-sections", element: <HomeSectionsPage /> },
          { path: "contact", element: <ContactSettingsPage /> },
          { path: "enquiry-settings", element: <EnquirySettingsPage /> },
          { path: "social-media", element: <SocialMediaPage /> },
          { path: "categories", element: <CategoriesPage /> },
          { path: "brands", element: <BrandsPage /> },
          { path: "category-brands", element: <CategoryBrandsPage /> },
          { path: "subcategories", element: <SubcategoriesPage /> },
          { path: "products", element: <ProductsAdminPage /> },
          { path: "products/:id/manage", element: <ProductManagementPage /> },
          { path: "enquiries", element: <EnquiriesPage /> },
          { path: "enquiries/:id", element: <EnquiryDetailsPage /> },
          {
            path: "*",
            element: <AdminPlaceholderPage title="Admin Page Not Found" />,
          },
        ],
      },
    ],
  },
]);
