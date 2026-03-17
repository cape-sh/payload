import { codeToHtml } from 'shiki'

export async function highlightCodeBlocks(html: string): Promise<string> {
  const codeBlockRegex = /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g

  const matches: { full: string; lang: string; code: string }[] = []
  let match
  while ((match = codeBlockRegex.exec(html)) !== null) {
    matches.push({ full: match[0], lang: match[1], code: match[2] })
  }

  let result = html
  for (const m of matches) {
    const decoded = m.code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")

    try {
      const highlighted = await codeToHtml(decoded, {
        lang: m.lang,
        theme: 'github-dark-default',
      })
      result = result.replace(m.full, highlighted)
    } catch {
      result = result.replace(
        m.full,
        `<pre class="shiki" style="background-color:#24292e"><code>${m.code}</code></pre>`,
      )
    }
  }

  const plainCodeRegex = /<pre><code>([\s\S]*?)<\/code><\/pre>/g
  const plainMatches: { full: string; code: string }[] = []
  let plainMatch
  while ((plainMatch = plainCodeRegex.exec(result)) !== null) {
    plainMatches.push({ full: plainMatch[0], code: plainMatch[1] })
  }

  for (const m of plainMatches) {
    result = result.replace(
      m.full,
      `<pre class="shiki" style="background-color:#24292e;padding:1rem;border-radius:0.5rem;overflow-x:auto"><code>${m.code}</code></pre>`,
    )
  }

  return result
}
