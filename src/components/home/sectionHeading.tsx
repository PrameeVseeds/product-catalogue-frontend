interface SectionHeadingProps { title?: string | null; subtitle?: string | null; description?: string | null }
export const SectionHeading = ({ title, subtitle, description }: SectionHeadingProps) => {
  if (!title && !subtitle && !description) return null
  return <header className="sectionHeading">
    {subtitle && <p className="eyebrow">{subtitle}</p>}
    {title && <h2>{title}</h2>}{description && <p>{description}</p>}</header>
}
