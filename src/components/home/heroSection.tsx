import type { CSSProperties } from "react";
import type { HeroContent } from "../../interfaces/site.interface";
import { getImageUrl } from "../../utils/getImageUrl";
import { ActionLink } from "../common/actionLink";

export const HeroSection = ({ hero }: { hero: HeroContent | null }) => {
  if (!hero?.isVisible) return null;
  const background = getImageUrl(hero.backgroundImage);
  const foreground = getImageUrl(hero.foregroundImage);
  const style = background
    ? ({
        "--hero-background": `url("${background}")`,
        "--hero-overlay-opacity": hero.overlayOpacity,
      } as CSSProperties)
    : undefined;
  return (
    <section
      className={`heroSection heroAlign${hero.textAlignment} ${foreground ? "heroHasForeground" : "heroTextOnly"}`}
      style={style}
    >
      <div className="container heroContent">
        <div className="heroCopy">
          {hero.subtitle && <p className="eyebrow">{hero.subtitle}</p>}
          {hero.title && <h1>{hero.title}</h1>}
          {hero.description && <p>{hero.description}</p>}
          <div className="heroActions">
            <ActionLink href={hero.primaryButtonUrl}>
              {hero.primaryButtonText}
            </ActionLink>
            <ActionLink
              className="button buttonSecondary"
              href={hero.secondaryButtonUrl}
            >
              {hero.secondaryButtonText}
            </ActionLink>
          </div>
        </div>
        {foreground && (
          <img className="heroImage" src={foreground} alt={hero.title ?? ""} />
        )}
      </div>
    </section>
  );
};
