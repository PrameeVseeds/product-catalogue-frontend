import { createBrowserRouter } from "react-router-dom";
import {
  ProtectedRoute,
  AdminLoginRoute,
} from "../components/admin/protectedRoute";
import { AdminLayout } from "../layouts/adminLayout";
import { SiteContentProvider } from "../hooks/siteContentProvider";
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

const adminPlaceholders = [
  ["categories", "Categories"],
  ["brands", "Brands"],
  ["category-brands", "Category Brands"],
  ["subcategories", "Subcategories"],
  ["products", "Products"],
  ["enquiries", "Enquiries"],
] as const;

export const appRouter = createBrowserRouter([
  {
    element: (
      <SiteContentProvider>
        <PublicLayout />
      </SiteContentProvider>
    ),
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
          ...adminPlaceholders.map(([path, title]) => ({
            path,
            element: <AdminPlaceholderPage title={title} />,
          })),
          {
            path: "*",
            element: <AdminPlaceholderPage title="Admin Page Not Found" />,
          },
        ],
      },
    ],
  },
]);
