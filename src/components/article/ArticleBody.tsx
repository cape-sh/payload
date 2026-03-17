import { RichText } from '@payloadcms/richtext-lexical/react'

interface ArticleBodyProps {
  content: any
}

export function ArticleBody({ content }: ArticleBodyProps) {
  if (!content) return null

  return (
    <div className="prose prose-invert mx-auto max-w-3xl prose-headings:text-white prose-p:text-accent-light prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-accent prose-li:text-accent-light">
      <RichText data={content} />
    </div>
  )
}
