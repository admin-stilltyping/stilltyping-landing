import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { Site } from './Site'
import { publicPages, notFoundMetadata } from './content'

export { publicPages }

export function renderPage(pathname: string) {
  const metadata = publicPages.find(page => page.path === pathname) ?? notFoundMetadata
  return { ...metadata, html: renderToString(<StrictMode><Site pathname={pathname} /></StrictMode>), noindex: metadata === notFoundMetadata }
}
