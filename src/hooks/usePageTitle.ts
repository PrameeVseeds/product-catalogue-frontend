import { useEffect } from "react";
import { useSiteContent } from "./useSiteContent";

const fallbackSiteName = "SEEDS PVT LTD";

export const usePageTitle = (pageTitle?: string | null) => {
  const { data } = useSiteContent();
  const siteName =
    data?.siteSettings.websiteTitle?.trim() ||
    data?.siteSettings.companyName?.trim() ||
    fallbackSiteName;
  const title = pageTitle?.trim();

  useEffect(() => {
    document.title = title ? `${title} | ${siteName}` : siteName;
  }, [siteName, title]);
};
