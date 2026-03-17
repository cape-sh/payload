interface YouTubeEmbedProps {
  url: string
  title?: string
}

export function YouTubeEmbed({ url, title = 'Video' }: YouTubeEmbedProps) {
  return (
    <div className="my-6 aspect-video overflow-hidden rounded-lg">
      <iframe
        src={url}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  )
}
