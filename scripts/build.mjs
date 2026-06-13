// Bundle de arquivo único: embute todo o JS em dist/index.html (entrega do PRD). D-16.
import { build } from 'esbuild'
import { readFile, writeFile, mkdir } from 'node:fs/promises'

const result = await build({
  entryPoints: ['src/main.js'],
  bundle: true,
  format: 'iife',
  minify: true,
  write: false,
  target: ['es2020'],
})

const js = result.outputFiles[0].text
const template = await readFile('index.html', 'utf8')

// Remove o <script type="module" src=...> de dev e injeta o JS inline.
const html = template.replace(
  /<script[^>]*src="\.\/src\/main\.js"[^>]*><\/script>/,
  `<script>${js}</script>`,
)

await mkdir('dist', { recursive: true })
await writeFile('dist/index.html', html, 'utf8')

const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1)
console.log(`dist/index.html gerado (${kb} kB, arquivo único, offline).`)
