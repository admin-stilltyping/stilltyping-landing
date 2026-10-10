import assert from 'node:assert/strict'
import { before, after, test } from 'node:test'
import { readFile } from 'node:fs/promises'
import { once } from 'node:events'
import { get } from 'node:http'
import { createPreviewServer } from '../scripts/preview.mjs'
import { renderMetadata } from '../scripts/seo.mjs'

const origin = 'https://stilltyping.in'
const paths = ['/', '/ai-customer-support', '/website-chatbot', '/appointment-booking', '/privacy']
let server, base
before(async () => {
  server = await createPreviewServer()
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  base = 'http://127.0.0.1:' + server.address().port
})
after(() => new Promise(resolve => server.close(resolve)))

test('every public URL delivers meaningful, unique HTML and metadata without executing JavaScript', async () => {
  const titles = new Set(), descriptions = new Set()
  for (const path of paths) {
    const response = await fetch(base + path)
    assert.equal(response.status, 200, path)
    const html = await response.text()
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1, path)
    assert.ok(html.includes('<main'), path)
    assert.ok(!html.includes('<div id="root"></div>'), path)
    assert.ok(html.replace(/<[^>]*>/g, '').length > 1500, path)
    assert.ok(!html.includes('<!--seo-head-->'), path)
    assert.equal([...html.matchAll(/rel="canonical"/g)].length, 1, path)
    assert.ok(html.includes('rel="canonical" href="' + origin + path + '"'), path)
    const title = html.match(/<title>(.*?)<\/title>/)[1]
    const description = html.match(/name="description" content="([^"]+)"/)[1]
    assert.ok(title.includes('stilltyping'), path)
    assert.ok(!titles.has(title) && !descriptions.has(description), path)
    titles.add(title); descriptions.add(description)
    assert.ok(html.includes('name="robots" content="index, follow, max-image-preview:large"'), path)
    assert.ok(html.includes('property="og:url" content="' + origin + path + '"'), path)
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])
    assert.equal(schema['@graph'].find(item => item['@type'] === 'WebPage').url, origin + path)
    assert.equal(schema['@graph'].find(item => item['@type'] === 'Organization').name, 'stilltyping')
    if (path !== '/') {
      const crumbs = schema['@graph'].find(item => item['@type'] === 'BreadcrumbList')
      assert.ok(crumbs.itemListElement[1].name)
      assert.equal(crumbs.itemListElement[1].item, origin + path)
    }
    assert.ok(!html.includes('aggregateRating') && !html.includes('priceCurrency'), path)
  }
})

test('sitemap and robots are real files containing only canonical public pages', async () => {
  const response = await fetch(base + '/sitemap.xml')
  assert.equal(response.status, 200)
  assert.match(response.headers.get('content-type'), /xml/)
  const sitemap = await response.text()
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]), paths.map(path => origin + path))
  const robots = await fetch(base + '/robots.txt')
  assert.equal(robots.status, 200)
  assert.match(robots.headers.get('content-type'), /text\/plain/)
  assert.match(await robots.text(), /Allow: \/\n\nSitemap: https:\/\/stilltyping\.in\/sitemap.xml/)
})

test('unknown URLs return a real, non-indexable 404 instead of the homepage', async () => {
  for (const path of ['/does-not-exist', '/missing-file.xml', '/website-chatbot/extra', '/404.html']) {
    const response = await fetch(base + path)
    assert.equal(response.status, 404, path)
    assert.equal(response.headers.get('x-robots-tag'), 'noindex', path)
    const html = await response.text()
    assert.match(html, /name="robots" content="noindex, follow"/)
    assert.ok(!html.includes('rel="canonical"'))
    assert.match(html, /That page isn’t here/)
  }
})

test('legacy hosts and duplicate path forms redirect to canonical URLs; portal actions still work', async () => {
  for (const host of ['www.stilltyping.in', 'stilltyping-landing.vercel.app']) {
    // Node fetch does not forward a caller-supplied Host header.
    const response = await new Promise((resolve, reject) => {
      get(base + '/website-chatbot?utm_source=test', { headers: { host } }, response => {
        response.resume()
        resolve(response)
      }).on('error', reject)
    })
    assert.equal(response.statusCode, 308)
    assert.equal(response.headers.location, origin + '/website-chatbot?utm_source=test')
  }
  for (const path of ['/website-chatbot/', '/website-chatbot/index.html']) {
    const response = await fetch(base + path, { redirect: 'manual' })
    assert.equal(response.status, 308)
    assert.equal(response.headers.get('location'), '/website-chatbot')
  }
  for (const path of ['/login', '/signup/']) {
    const response = await fetch(base + path, { redirect: 'manual' })
    assert.equal(response.status, 307)
    assert.equal(response.headers.get('location'), 'https://app.stilltyping.in' + path.replace(/\/$/, ''))
  }
})

test('all public pages are internally discoverable and their local assets exist', async () => {
  for (const path of paths) {
    const html = await (await fetch(base + path)).text()
    for (const link of paths.filter(item => item !== path)) assert.ok(html.includes('href="' + link + '"'), path + ' links to ' + link)
    const assets = [...html.matchAll(/(?:src|href)="(\/(?:assets\/[^"]+|stilltyping\.png))"/g)].map(match => match[1])
    for (const asset of new Set(assets)) assert.equal((await fetch(base + asset)).status, 200, asset)
    const signup = 'href="https://app.stilltyping.in/signup"'
    assert.ok(html.includes(signup), path + ' preserves signup')
  }
})

test('preview metadata stays noindex and verification tokens cannot inject markup', () => {
  const page = { path: '/', title: 'stilltyping', description: 'Customer support' }
  const html = renderMetadata(page, { preview: true, verification: 'token"><script>alert(1)</script>' })
  assert.match(html, /name="robots" content="noindex, follow"/)
  assert.ok(!html.includes('<script>alert(1)</script>'))
  assert.match(html, /name="google-site-verification"/)
})

test('appointment copy preserves the staff-confirmation and availability limitations', async () => {
  const html = await (await fetch(base + '/appointment-booking')).text()
  assert.match(html, /pending staff confirmation/)
  assert.match(html, /does not check a live staff calendar/)
  const config = JSON.parse(await readFile(new URL('../.vercel/output/config.json', import.meta.url), 'utf8'))
  assert.equal(config.routes.at(-1).status, 404)
})


test('privacy is public on the Stilltyping domain with the approved contact', async () => {
  const response = await fetch(base + '/privacy', { redirect: 'manual' })
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('location'), null)
  const html = await response.text()
  assert.match(html, /support@stilltyping\.in/)
  assert.doesNotMatch(html, /nivaso/i)
})
