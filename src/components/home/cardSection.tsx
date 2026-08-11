import type { HomeSection } from "../../interfaces/site.interface";
import { getImageUrl } from "../../utils/getImageUrl";
import { ActionLink } from "../common/actionLink";
import { DynamicIcon } from "../common/dynamicIcon";
import { SectionHeading } from "./sectionHeading";

export const CardSection = ({ section }: { section: HomeSection }) => (
  <section className="homeSection surfaceSection serviceCardsSection">
    <div className="container">
      <SectionHeading
        title={section.title}
        subtitle={section.subtitle}
        description={section.description}
      />
      <div className="cardGrid serviceCardGrid">
        {section.items.map((item) => {
          const image = getImageUrl(item.imageUrl);
          return (
            <article className="serviceCard" key={item.id}>
              {image && (
                <img
                  className="serviceCardImage"
                  src={image}
                  alt={item.title}
                  loading="lazy"
                />
              )}
              <div className="serviceCardBody">
                <div className="serviceCardHeading">
                  {item.iconName && (
                    <span className="serviceCardIcon">
                      <DynamicIcon name={item.iconName} aria-hidden="true" />
                    </span>
                  )}
                  <div>
                    <h3>{item.title}</h3>
                    {item.subtitle && (
                      <p className="cardMeta">{item.subtitle}</p>
                    )}
                  </div>
                </div>
                {item.description && <p>{item.description}</p>}
                <ActionLink className="serviceCardLink" href={item.buttonLink}>
                  {item.buttonText}
                </ActionLink>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);
