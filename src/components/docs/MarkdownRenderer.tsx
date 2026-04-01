import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'
import { preprocessAdmonitions } from '@/lib/docs/remark-admonitions'
import { stripMkDocsExtensions } from '@/lib/docs/strip-mkdocs-attrs'
import { rehypeRewriteLinks } from '@/lib/docs/rewrite-links'
import { highlightCodeBlocks } from '@/components/docs/CodeBlock'
import { rewriteImagePaths } from '@/components/docs/DocsImage'
import type { TocHeading } from '@/components/docs/DocsTableOfContents'

export async function renderMarkdown(rawContent: string): Promise<{ html: string; headings: TocHeading[] }> {
  // Preprocess: strip MkDocs extensions, convert admonitions to HTML
  let processed = stripMkDocsExtensions(rawContent)
  processed = preprocessAdmonitions(processed)

  // Convert swagger-ui tags to links to interactive Scalar API viewer
  processed = processed.replace(
    /<swagger-ui[^>]*name="([^"]*)"[^>]*src="\.\/api\/([^"]*)"[^>]*\/>/g,
    (_match, name: string, file: string) => {
      const slug = file.replace('.json', '').toLowerCase().replace(/_/g, '-')
      return `<div class="swagger-link group my-4 rounded-lg border border-dark-light bg-dark-light/50 p-4 transition-colors hover:border-accent/40">
        <a href="/docs/api/${slug}" class="flex items-center justify-between no-underline">
          <div>
            <h3 class="mb-1 text-base font-semibold text-white group-hover:text-accent">${name}</h3>
            <p class="text-sm text-accent-light">Interactive API reference</p>
          </div>
          <span class="text-accent text-lg">&rarr;</span>
        </a>
      </div>`
    },
  )

  // Run unified pipeline
  const result = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeRewriteLinks)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(processed)

  let html = String(result)

  // Post-process: rewrite image paths, highlight code blocks
  html = rewriteImagePaths(html)
  html = await highlightCodeBlocks(html)

  // Make YouTube iframes responsive
  html = html.replace(
    /(<iframe[^>]*src="https:\/\/www\.youtube\.com[^"]*"[^>]*><\/iframe>)/g,
    '<div class="youtube-embed my-6 aspect-video overflow-hidden rounded-lg">$1</div>',
  )

  // Extract headings for TOC
  const headings: TocHeading[] = []
  const headingRegex = /<(h[23])\s+id="([^"]*)"[^>]*>([\s\S]*?)<\/\1>/g
  let match
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1].charAt(1))
    const id = match[2]
    // Strip HTML tags from heading text
    const text = match[3].replace(/<[^>]*>/g, '').trim()
    headings.push({ id, text, level })
  }

  return { html, headings }
}

interface MarkdownRendererProps {
  content: string
}

export async function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { html } = await renderMarkdown(content)
  return (
    <div
      className="docs-prose prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
