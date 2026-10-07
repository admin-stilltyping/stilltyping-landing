import { siteUrl } from '../config.mjs'

export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char])

export function renderMetadata(page, { preview = false, verification = '' } = {}) {
  const url = new URL(page.path, siteUrl).href
  const noindex = preview || page.noindex
  const meta = (name, value, attribute = 'name') => '<meta ' + attribute + '="' + name + '" content="' + escapeHtml(value) + '" />'
  const tags = [
    meta('robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'),
    ...(!page.noindex ? ['<link rel="canonical" href="' + escapeHtml(url) + '" />'] : []),
    meta('og:type', 'website', 'property'),
    meta('og:site_name', 'stilltyping', 'property'),
    meta('og:title', page.title, 'property'),
    meta('og:description', page.description, 'property'),
    meta('og:url', url, 'property'),
    meta('og:locale', 'en_IN', 'property'),
    meta('og:image', siteUrl + '/stilltyping.png', 'property'),
    meta('og:image:width', '1254', 'property'),
    meta('og:image:height', '1254', 'property'),
    meta('og:image:alt', 'stilltyping — three dots in white, lavender, and purple', 'property'),
    meta('twitter:card', 'summary'),
    meta('twitter:title', page.title),
    meta('twitter:description', page.description),
    meta('twitter:image', siteUrl + '/stilltyping.png'),
    meta('twitter:image:alt', 'stilltyping logo'),
  ]
  if (verification) tags.push(meta('google-site-verification', verification))
  if (!page.noindex) {
    const graph = [
      { '@type': 'Organization', '@id': siteUrl + '/#organization', name: 'stilltyping', url: siteUrl + '/', logo: siteUrl + '/stilltyping.png' },
      { '@type': 'WebSite', '@id': siteUrl + '/#website', name: 'stilltyping', url: siteUrl + '/', publisher: { '@id': siteUrl + '/#organization' } },
      { '@type': 'WebPage', '@id': url + '#webpage', url, name: page.title, description: page.description, inLanguage: 'en', isPartOf: { '@id': siteUrl + '/#website' } },
    ]
    if (page.path !== '/') graph.push({
      '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl + '/' },
        { '@type': 'ListItem', position: 2, name: page.label, item: url },
      ],
    })
    const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
    tags.push('<script type="application/ld+json">' + json + '</script>')
  }
  return tags.join('\n    ')
}
