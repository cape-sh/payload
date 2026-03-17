import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  baseUrl: string
}

export function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  baseUrl,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const separator = baseUrl.includes('?') ? '&' : '?'

  return (
    <div className="mt-12 flex items-center justify-center gap-4">
      {hasPrevPage ? (
        <Link
          href={`${baseUrl}${separator}page=${currentPage - 1}`}
          className="rounded-lg border border-dark-light px-4 py-2 text-sm font-medium text-accent-light transition-colors hover:border-accent hover:text-white"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-lg border border-dark-light px-4 py-2 text-sm font-medium text-accent-light/30">
          Previous
        </span>
      )}

      <span className="text-sm text-accent-light">
        Page {currentPage} of {totalPages}
      </span>

      {hasNextPage ? (
        <Link
          href={`${baseUrl}${separator}page=${currentPage + 1}`}
          className="rounded-lg border border-dark-light px-4 py-2 text-sm font-medium text-accent-light transition-colors hover:border-accent hover:text-white"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-lg border border-dark-light px-4 py-2 text-sm font-medium text-accent-light/30">
          Next
        </span>
      )}
    </div>
  )
}
