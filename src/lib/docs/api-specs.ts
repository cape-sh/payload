import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const API_DIR = join(process.cwd(), 'content', 'docs', 'api')

/** Map of URL-friendly name → filename (without .json) */
const SPEC_NAMES: Record<string, string> = {}

// Build map on first import
const files = readdirSync(API_DIR).filter(
  (f) => f.endsWith('.json') && !f.endsWith('.schema.json'),
)
for (const file of files) {
  const name = file.replace('.json', '')
  // URL-friendly: lowercase, dashes
  const slug = name.toLowerCase().replace(/_/g, '-')
  SPEC_NAMES[slug] = name
}

export function getAllApiSpecSlugs(): string[] {
  return Object.keys(SPEC_NAMES)
}

export function getApiSpec(slug: string): { specContent: string; title: string } | null {
  const filename = SPEC_NAMES[slug]
  if (!filename) return null

  const filePath = join(API_DIR, `${filename}.json`)
  try {
    const raw = readFileSync(filePath, 'utf-8')
    const spec = JSON.parse(raw)
    const title = spec.info?.title || filename
    return { specContent: raw, title }
  } catch {
    return null
  }
}

/** Returns list of { slug, title } for all specs */
export function listApiSpecs(): { slug: string; title: string; filename: string }[] {
  return Object.entries(SPEC_NAMES).map(([slug, filename]) => {
    const filePath = join(API_DIR, `${filename}.json`)
    try {
      const raw = readFileSync(filePath, 'utf-8')
      const spec = JSON.parse(raw)
      return { slug, title: spec.info?.title || filename, filename: `${filename}.json` }
    } catch {
      return { slug, title: filename, filename: `${filename}.json` }
    }
  })
}
