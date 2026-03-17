/**
 * Preprocessor that converts MkDocs admonition syntax (!!!/???? blocks)
 * into HTML before remark parses the markdown.
 *
 * Supports:
 *   !!! info            — standard admonition
 *   !!! warning "Title" — admonition with custom title
 *   ??? info            — collapsible (rendered as <details>)
 *   ??? tip "Title"     — collapsible with custom title
 */
export function preprocessAdmonitions(markdown: string): string {
  const lines = markdown.split('\n')
  const result: string[] = []
  let i = 0

  while (i < lines.length) {
    const match = lines[i].match(/^(!!!|\?\?\?) (\w+)(?:\s+"([^"]*)")?/)
    if (match) {
      const [, marker, type, customTitle] = match
      const title = customTitle || type.charAt(0).toUpperCase() + type.slice(1)
      const normalizedType = type.toLowerCase()
      const isCollapsible = marker === '???'

      // Collect indented body lines
      const bodyLines: string[] = []
      i++
      while (i < lines.length && (lines[i].startsWith('    ') || lines[i].trim() === '')) {
        if (lines[i].trim() === '' && i + 1 < lines.length && !lines[i + 1].startsWith('    ')) {
          break
        }
        bodyLines.push(lines[i].startsWith('    ') ? lines[i].slice(4) : lines[i])
        i++
      }

      const body = bodyLines.join('\n').trim()

      if (isCollapsible) {
        result.push(
          `<details class="admonition admonition-${normalizedType}" data-type="${normalizedType}">`,
        )
        result.push(`<summary class="admonition-title">${title}</summary>`)
        result.push(`<div class="admonition-content">\n\n${body}\n\n</div>`)
        result.push(`</details>`)
      } else {
        result.push(
          `<div class="admonition admonition-${normalizedType}" data-type="${normalizedType}">`,
        )
        result.push(`<div class="admonition-title">${title}</div>`)
        result.push(`<div class="admonition-content">\n\n${body}\n\n</div>`)
        result.push(`</div>`)
      }
      result.push('')
    } else {
      result.push(lines[i])
      i++
    }
  }

  return result.join('\n')
}
