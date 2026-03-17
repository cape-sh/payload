import { visit } from 'unist-util-visit'
import type { Root, Element } from 'hast'

/**
 * Rehype plugin that rewrites links for the docs system:
 * - .md relative links become /docs/ routes
 * - External links get target="_blank" rel="noopener noreferrer"
 * - Anchor-only links (#section) are left as-is
 */
export function rehypeRewriteLinks() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'a' || !node.properties?.href) return

      let href = String(node.properties.href)

      // External links
      if (href.startsWith('http://') || href.startsWith('https://')) {
        node.properties.target = '_blank'
        node.properties.rel = 'noopener noreferrer'
        return
      }

      // Anchor-only links
      if (href.startsWith('#')) return

      // Rewrite .md links to /docs/ routes
      if (href.includes('.md')) {
        const [pathPart, anchor] = href.split('#')
        let cleanPath = pathPart.replace(/\.md$/, '')
        // Remove trailing /index
        cleanPath = cleanPath.replace(/\/index$/, '')
        href = cleanPath + (anchor ? `#${anchor}` : '')
        node.properties.href = href
      }
    })
  }
}
