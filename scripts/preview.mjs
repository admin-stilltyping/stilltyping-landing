import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { resolve, sep, extname } from 'node:path'

const staticRoot = resolve(fileURLToPath(new URL('../.vercel/output/static/', import.meta.url)))
const configUrl = new URL('../.vercel/output/config.json', import.meta.url)
const types = { '.html': 'text/html; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' }

// Preview the built artifact using its generated Vercel route order.
export async function createPreviewServer() {
  const { routes } = JSON.parse(await readFile(configUrl, 'utf8'))
  return createServer(async (request, response) => {
    const headers = {}
    const host = (request.headers.host || '').split(':')[0]
    let pathname
    try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname) }
    catch { response.writeHead(400).end(); return }
    async function sendFile(path, status = 200) {
      const candidate = resolve(staticRoot, '.' + path)
      if (candidate !== staticRoot && !candidate.startsWith(staticRoot + sep)) return false
      try {
        const file = (await stat(candidate)).isDirectory() ? resolve(candidate, 'index.html') : candidate
        const body = await readFile(file)
        response.writeHead(status, { ...headers, 'Content-Type': types[extname(file)] || 'application/octet-stream' })
        response.end(request.method === 'HEAD' ? undefined : body)
        return true
      } catch (error) {
        if (['ENOENT', 'ENOTDIR', 'EISDIR'].includes(error.code)) return false
        throw error
      }
    }
    try {
      for (const route of routes) {
        if (route.handle === 'filesystem') {
          if (await sendFile(pathname)) return
          continue
        }
        if (route.has?.some(condition => condition.type !== 'host' || condition.value !== host)) continue
        const expression = new RegExp('^(?:' + route.src + ')$')
        if (!expression.test(pathname)) continue
        for (const [name, value] of Object.entries(route.headers || {})) headers[name] = pathname.replace(expression, value)
        if (route.continue) continue
        if (headers.Location) {
          // Vercel preserves incoming query parameters on redirects.
          const search = new URL(request.url, 'http://localhost').search
          response.writeHead(route.status, { ...headers, Location: headers.Location + search }).end()
          return
        }
        if (route.dest && await sendFile(route.dest, route.status)) return
      }
      response.writeHead(404).end()
    } catch (error) {
      console.error(error)
      response.writeHead(500).end('Preview failed')
    }
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const server = await createPreviewServer()
  const port = Number(process.env.PORT || 5176)
  server.listen(port, '127.0.0.1', () => console.log('Built site: http://127.0.0.1:' + port))
}
