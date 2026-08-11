import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "../components/common/footer";
import { Navbar } from "../components/common/navbar";
import { useSiteContent } from "../hooks/useSiteContent";
import type { ThemeSettings } from "../interfaces/site.interface";
import { usePageTitle } from "../hooks/usePageTitle";

const themeVariables: [keyof ThemeSettings, string][] = [
  ["primaryColor", "--primary-color"],
  ["secondaryColor", "--secondary-color"],
  ["backgroundColor", "--background-color"],
  ["surfaceColor", "--surface-color"],
  ["textColor", "--text-color"],
  ["mutedTextColor", "--muted-text-color"],
  ["buttonBackgroundColor", "--button-background-color"],
  ["buttonTextColor", "--button-text-color"],
  ["headerBackgroundColor", "--header-background-color"],
  ["footerBackgroundColor", "--footer-background-color"],
  ["footerTextColor", "--footer-text-color"],
];

export const PublicLayout = () => {
  const { pathname } = useLocation();
  const { data } = useSiteContent();
  const fallbackTitle =
    pathname === "/"
      ? null
      : pathname === "/products"
        ? "Products"
        : pathname === "/contact"
          ? "Contact Us"
          : pathname.startsWith("/products/")
            ? "Products"
            : pathname.startsWith("/categories/")
              ? "Category"
              : pathname.startsWith("/subcategories/")
                ? "Subcategory"
                : pathname.startsWith("/brands/")
                  ? "Brand"
                  : "Page Not Found";
  usePageTitle(fallbackTitle);
  const style = Object.fromEntries(
    themeVariables.flatMap(([key, variable]) =>
      data?.themeSettings[key] ? [[variable, data.themeSettings[key]]] : [],
    ),
  ) as React.CSSProperties;
  return (
    <div className="siteShell" style={style}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
