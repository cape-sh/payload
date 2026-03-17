import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const DOCS_DIR = path.join(process.cwd(), 'content/docs')

export interface DocMeta {
  title?: string
  description?: string
  [key: string]: unknown
}

export interface Doc {
  content: string
  meta: DocMeta
  slug: string
}

export function getDoc(slugParts: string[]): Doc | null {
  const slug = slugParts.join('/')
  // Try exact path first, then with /index
  const candidates = [
    path.join(DOCS_DIR, `${slug || 'index'}.md`),
    path.join(DOCS_DIR, slug, 'index.md'),
  ]

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)
      return { content, meta: data as DocMeta, slug }
    }
  }
  return null
}
