import type { SocialLink } from "../../interfaces/site.interface";
import { getSocialPlatform } from "../../config/socialPlatformConfig";
import { safeExternalUrl } from "../../utils/safeExternalUrl";

interface SocialLinksProps {
  links: SocialLink[];
  companyName?: string | null;
}

export const SocialLinks = ({ links, companyName }: SocialLinksProps) => {
  const activeLinks = links
    .map((link) => ({
      ...link,
      config: getSocialPlatform(link.platform),
      safeUrl: link.isActive ? safeExternalUrl(link.url) : "",
    }))
    .filter((link) => link.safeUrl && link.config)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  if (!activeLinks.length) return null;
  return (
    <div className="socialLinks" aria-label="Social media">
      {activeLinks.map((link) => {
        const config = link.config;
        if (!config) return null;
        const Icon = config.icon;
        const label = link.displayName || config.label;
        return (
          <a
            key={link.id ?? `${link.platform}-${link.url}`}
            className={`socialIcon socialIcon-${config.value}`}
            href={link.safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${companyName || "our company"} on ${label}`}
            title={label}
            style={{
              backgroundColor: config.brandColor,
              color: config.iconColor,
            }}
          >
            <Icon aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
};
