import type { AnchorHTMLAttributes } from 'react'

type PageLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string }

export function PageLink({ to, ...props }: PageLinkProps) {
  const portalUrl = import.meta.env.VITE_PUBLIC_PORTAL_URL?.replace(/\/$/, '')
  const href = portalUrl && ['/login', '/signup', '/privacy'].includes(to)
    ? `${portalUrl}${to}`
    : to
  // Each public URL has its own HTML and metadata, including without JavaScript.
  return <a {...props} href={href} />
}
