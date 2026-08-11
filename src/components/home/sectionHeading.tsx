interface SectionHeadingProps {
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
}
export const SectionHeading = ({
  title,
  subtitle,
  description,
}: SectionHeadingProps) => {
  if (!title && !subtitle && !description) return null;
  return (
    <header className="sectionHeading">
      {title && <h2>{title}</h2>}
      {subtitle && <p className="eyebrow">{subtitle}</p>}
      {description && <p>{description}</p>}
    </header>
  );
};
