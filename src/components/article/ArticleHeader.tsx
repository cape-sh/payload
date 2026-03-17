import Image from 'next/image'

interface ArticleHeaderProps {
  title: string
  author?: string | null
  publishDate?: string | null
  readingTime?: number | null
  tags?: { tag: string }[] | null
  featureImage?: { url: string; alt: string; width: number; height: number } | null
}

export function ArticleHeader({
  title,
  author,
  publishDate,
  readingTime,
  tags,
  featureImage,
}: ArticleHeaderProps) {
  return (
    <header className="mx-auto max-w-3xl">
      {tags && tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <span
              key={i}
              className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent"
            >
              {t.tag}
            </span>
          ))}
        </div>
      )}

      <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">{title}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-accent-light">
        {author && <span>{author}</span>}
        {author && publishDate && <span>&middot;</span>}
        {publishDate && (
          <time dateTime={publishDate}>
            {new Date(publishDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
        )}
        {readingTime && (
          <>
            <span>&middot;</span>
            <span>{readingTime} min read</span>
          </>
        )}
      </div>

      {featureImage?.url && (
        <div className="mt-8 overflow-hidden rounded-lg">
          <Image
            src={featureImage.url}
            alt={featureImage.alt || title}
            width={featureImage.width || 1200}
            height={featureImage.height || 630}
            priority
            className="w-full"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}
    </header>
  )
}
