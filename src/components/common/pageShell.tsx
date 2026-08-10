import type { PropsWithChildren } from 'react'
interface PageShellProps extends PropsWithChildren { title: string }
export const PageShell = ({ title, children }: PageShellProps) => <section className="container pageSection"><h1>{title}</h1>{children}</section>
