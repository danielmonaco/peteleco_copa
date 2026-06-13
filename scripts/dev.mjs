// Servidor estático simples p/ dev (ES modules carregam via HTTP).
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// ROOT = raiz do projeto (pasta acima de scripts/), independente do cwd de quem inicia.
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = process.env.PORT || 5180

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
}

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(req.url.split('?')[0])
    if (path === '/') path = '/index.html'
    const file = normalize(join(ROOT, path))
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end('Forbidden')
      return
    }
    const data = await readFile(file)
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' })
    res.end(data)
  } catch {
    res.writeHead(404).end('Not found')
  }
})

server.listen(PORT, () => {
  console.log(`Peteleco da Copa (dev) → http://localhost:${PORT}`)
})
