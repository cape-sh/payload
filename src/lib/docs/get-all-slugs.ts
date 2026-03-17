import fs from 'fs'
import path from 'path'

const DOCS_DIR = path.join(process.cwd(), 'content/docs')

export function getAllSlugs(): string[][] {
  const slugs: string[][] = []

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.name.endsWith('.md')) {
        const relative = path.relative(DOCS_DIR, fullPath)
        const slug = relative.replace(/\.md$/, '')
        if (slug === 'index') {
          slugs.push([]) // root /docs
        } else if (slug.endsWith('/index')) {
          slugs.push(slug.replace(/\/index$/, '').split('/'))
        } else {
          slugs.push(slug.split('/'))
        }
      }
    }
  }

  walk(DOCS_DIR)
  return slugs
}
