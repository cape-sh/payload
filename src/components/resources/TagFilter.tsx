import Link from 'next/link'

interface TagFilterProps {
  tags: string[]
  activeTag?: string
}

export function TagFilter({ tags, activeTag }: TagFilterProps) {
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/resources"
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
          !activeTag
            ? 'bg-accent-dark text-white'
            : 'bg-dark-light text-accent-light hover:text-white'
        }`}
      >
        All
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/resources?tag=${encodeURIComponent(tag)}`}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            activeTag === tag
              ? 'bg-accent-dark text-white'
              : 'bg-dark-light text-accent-light hover:text-white'
          }`}
        >
          {tag}
        </Link>
      ))}
    </div>
  )
}
