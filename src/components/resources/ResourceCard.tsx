import Link from 'next/link'
import Image from 'next/image'

interface ResourceCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resource: any
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const featureImage =
    resource.feature_image && typeof resource.feature_image === 'object'
      ? resource.feature_image
      : null
  const primaryTag = resource.tags?.[0]?.tag
  const excerpt = resource.excerpt
    ? resource.excerpt.length > 120
      ? resource.excerpt.slice(0, 120) + '...'
      : resource.excerpt
    : null

  return (
    <Link
      href={`/resources/${resource.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-dark-light transition-colors hover:border-accent"
    >
      {featureImage?.url && (
        <div className="relative aspect-video overflow-hidden bg-dark-light">
          <Image
            src={featureImage.url}
            alt={featureImage.alt || resource.title}
            width={featureImage.width || 800}
            height={featureImage.height || 450}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        {primaryTag && (
          <span className="mb-2 inline-block w-fit rounded bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
            {primaryTag}
          </span>
        )}

        <h3 className="text-lg font-semibold text-white group-hover:text-accent">
          {resource.title}
        </h3>

        {excerpt && (
          <p className="mt-2 flex-1 text-sm text-accent-light">{excerpt}</p>
        )}

        <div className="mt-4 flex items-center gap-3 text-xs text-accent-light">
          {resource.author && <span>{resource.author}</span>}
          {resource.author && resource.reading_time && <span>&middot;</span>}
          {resource.reading_time && <span>{resource.reading_time} min read</span>}
          {(resource.author || resource.reading_time) && resource.publish_date && (
            <span>&middot;</span>
          )}
          {resource.publish_date && (
            <time dateTime={resource.publish_date}>
              {new Date(resource.publish_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          )}
        </div>
      </div>
    </Link>
  )
}
