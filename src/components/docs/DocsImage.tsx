export function rewriteImagePaths(html: string): string {
  return html.replace(/src="([^"]+)"/g, (match, src: string) => {
    if (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:')) {
      return match
    }
    if (src.includes('/img/')) {
      const filename = src.split('/img/').pop()
      return `src="/docs/img/${filename}"`
    }
    return `src="/docs/${src}"`
  })
}
