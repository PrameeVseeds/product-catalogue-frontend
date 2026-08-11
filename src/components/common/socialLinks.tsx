import type { SocialLink } from "../../interfaces/site.interface";
import { safeExternalUrl } from "../../utils/safeExternalUrl";

export const SocialLinks = ({ links }: { links: SocialLink[] }) => {
  const activeLinks = links
    .map((link) => ({
      ...link,
      safeUrl: link.isActive ? safeExternalUrl(link.url) : "",
    }))
    .filter((link) => link.safeUrl);
  if (!activeLinks.length) return null;
  return (
    <div className="socialLinks" aria-label="Social media">
      {activeLinks.map((link) => (
        <a
          key={link.id ?? `${link.platform}-${link.url}`}
          href={link.safeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.platform}
        </a>
      ))}
    </div>
  );
};
