export interface AdminNavigationItem {
  label: string;
  to: string;
  end?: boolean;
}
export interface AdminNavigationGroup {
  label?: string;
  items: AdminNavigationItem[];
}

export const adminNavigation: AdminNavigationGroup[] = [
  { items: [{ label: "Dashboard", to: "/admin", end: true }] },
  {
    label: "Website",
    items: [
      { label: "Site Settings", to: "/admin/site-settings" },
      { label: "Theme", to: "/admin/theme" },
      { label: "Hero", to: "/admin/hero" },
      { label: "Home Sections", to: "/admin/home-sections" },
      { label: "Contact", to: "/admin/contact" },
      { label: "Enquiry Settings", to: "/admin/enquiry-settings" },
      { label: "Social Media", to: "/admin/social-media" },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { label: "Categories", to: "/admin/categories" },
      { label: "Brands", to: "/admin/brands" },
      { label: "Category Brands", to: "/admin/category-brands" },
      { label: "Subcategories", to: "/admin/subcategories" },
      { label: "Products", to: "/admin/products" },
    ],
  },
  {
    label: "Customers",
    items: [{ label: "Enquiries", to: "/admin/enquiries" }],
  },
];
