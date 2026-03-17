/**
 * Preprocessor that removes MkDocs-specific extensions from markdown:
 * - {: .class-name} attribute lists
 * - {: target="_blank"} attribute blocks
 * - {:target="_blank"} (no-space variant)
 * - === "Tab Name" tabbed content markers (converted to bold headings)
 *
 * Skips content inside fenced code blocks.
 */
export function stripMkDocsExtensions(markdown: string): string {
  const lines = markdown.split('\n')
  let inCodeBlock = false

  return lines
    .map((line) => {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock
      }
      if (inCodeBlock) return line

      // Remove {: ...} attribute syntax
      line = line.replace(/\s*\{:\s*[^}]*\}/g, '')

      // Convert tabbed content === "Title" to bold text
      const tabMatch = line.match(/^===\s+"([^"]+)"/)
      if (tabMatch) {
        return `**${tabMatch[1]}**`
      }

      return line
    })
    .join('\n')
}
