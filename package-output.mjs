import { writeFile } from 'node:fs/promises'
import { portalUrl } from './config.mjs'

const config = {
  version: 3,
  routes: [
    ...['login', 'signup', 'privacy'].map(path => ({
      src: `/${path}/?`,
      status: 307,
      headers: { Location: `${portalUrl}/${path}` },
    })),
    { handle: 'filesystem' },
    { src: '/.*', dest: '/index.html' },
  ],
}

await writeFile(new URL('./.vercel/output/config.json', import.meta.url), `${JSON.stringify(config, null, 2)}\n`)
