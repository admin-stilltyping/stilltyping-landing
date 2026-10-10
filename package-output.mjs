import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { portalUrl, siteUrl, redirectHosts } from './config.mjs'
import { publicPages, renderPage } from './.ssr/entry-server.js'
import { escapeHtml, renderMetadata } from './scripts/seo.mjs'

const output = new URL('./.vercel/output/static/', import.meta.url)
const template = await readFile(new URL('index.html', output), 'utf8')
const preview = process.env.VERCEL_ENV === 'preview'
  || ['deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT)
if (!template.includes('<!--seo-head-->') || !template.includes('<div id="root"></div>')) {
  throw new Error('The HTML template is missing a prerendering placeholder.')
}

for (const pathname of [...publicPages.map(page => page.path), '/404']) {
  const page = renderPage(pathname)
  const html = template
    .replace(/<title>[^<]*<\/title>/, () => '<title>' + escapeHtml(page.title) + '</title>')
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, () => '<meta name="description" content="' + escapeHtml(page.description) + '" />')
    .replace('<!--seo-head-->', () => renderMetadata(page, { preview, verification: process.env.GOOGLE_SITE_VERIFICATION }))
    .replace('<div id="root"></div>', () => '<div id="root">' + page.html + '</div>')
  const relative = pathname === '/' ? 'index.html' : pathname === '/404' ? '404.html' : pathname.slice(1) + '/index.html'
  const destination = new URL(relative, output)
  await mkdir(new URL('./', destination), { recursive: true })
  await writeFile(destination, html)
}

const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + publicPages.map(page => '  <url><loc>' + escapeHtml(new URL(page.path, siteUrl).href) + '</loc></url>').join('\n')
  + '\n</urlset>\n'
await writeFile(new URL('sitemap.xml', output), sitemap)
await writeFile(new URL('robots.txt', output), 'User-agent: *\nAllow: /\n\nSitemap: ' + siteUrl + '/sitemap.xml\n')

const config = {
  version: 3,
  routes: [
    // Exact legacy hosts only: preview deployment hosts stay available for review.
    ...redirectHosts.map(host => ({ src: '/(.*)', has: [{ type: 'host', value: host }], status: 308, headers: { Location: siteUrl + '/$1' } })),
    ...(preview ? [{ src: '/.*', headers: { 'X-Robots-Tag': 'noindex' }, continue: true }] : []),
    ...['login', 'signup', 'privacy'].map(path => ({ src: '/' + path + '/?', status: 307, headers: { Location: portalUrl + '/' + path } })),
    { src: '/index\\.html', status: 308, headers: { Location: '/' } },
    ...publicPages.filter(page => page.path !== '/').flatMap(page => [
      { src: page.path + '/(?:index\\.html)?', status: 308, headers: { Location: page.path } },
      { src: page.path, dest: page.path + '/index.html' },
    ]),
    { src: '/404(?:\\.html)?', dest: '/404.html', status: 404, headers: { 'X-Robots-Tag': 'noindex' } },
    { handle: 'filesystem' },
    { src: '/.*', dest: '/404.html', status: 404, headers: { 'X-Robots-Tag': 'noindex' } },
  ],
}
await writeFile(new URL('./.vercel/output/config.json', import.meta.url), JSON.stringify(config, null, 2) + '\n')
console.log('Prerendered ' + publicPages.length + ' public pages and a 404 page for ' + siteUrl + (preview ? ' (noindex preview)' : '') + '.')
