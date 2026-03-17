import { ResourceCard } from '@/components/resources/ResourceCard'

interface RelatedPostsProps {
  posts: any[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="mt-16 border-t border-dark-light pt-12">
      <h2 className="mb-8 text-2xl font-bold text-white">Related Articles</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ResourceCard key={post.id} resource={post} />
        ))}
      </div>
    </section>
  )
}
