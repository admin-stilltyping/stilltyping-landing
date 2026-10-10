import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { portalUrl } from '../config.mjs'
import { publicPages } from '../.ssr/entry-server.js'

const source = new URL('../.vercel/output/static/', import.meta.url)
const output = new URL('../dist/', import.meta.url)
await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })
await cp(source, output, { recursive: true })

// Netlify uses 302 for temporary redirects (307 is unsupported). Keep its
// default domain accessible until the custom domain's DNS has been migrated.
// Do not use an SPA catch-all: missing public URLs must remain real 404s.
const redirects = [
  ...['login', 'signup', 'privacy'].map(path => `/${path} ${portalUrl}/${path} 302!`),
  '/index.html / 301!',
  ...publicPages.filter(page => page.path !== '/').flatMap(page => [
    `${page.path}/index.html ${page.path} 301!`,
    `${page.path} ${page.path}/index.html 200`,
  ]),
  '/404 /404.html 404!',
  '/404.html /404.html 404!',
  '/* /404.html 404',
]
await writeFile(new URL('_redirects', output), redirects.join('\n') + '\n')

const preview = ['deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT)
const headers = [
  '/assets/*\n  Cache-Control: public, max-age=31536000, immutable',
  '/404\n  X-Robots-Tag: noindex',
  '/404.html\n  X-Robots-Tag: noindex',
  ...(preview ? ['/*\n  X-Robots-Tag: noindex'] : []),
]
await writeFile(new URL('_headers', output), headers.join('\n\n') + '\n')
console.log('Netlify static deployment prepared in dist/.')
