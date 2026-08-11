import { Link } from 'react-router-dom'

interface ActionLinkProps { href?: string | null; children: React.ReactNode; className?: string }
export const ActionLink = ({ href, children, className = 'button' }: ActionLinkProps) => {
  const value = href?.trim()
  if (!value || children === null || children === undefined || children === '') return null
  if (value.startsWith('/') || value.startsWith('#')) return <Link className={className} to={value}>{children}</Link>
  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return <a className={className} href={url.href} target="_blank" rel="noopener noreferrer">{children}</a>
  } catch { return null }
}
