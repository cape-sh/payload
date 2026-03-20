'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  url: string
  meta?: { title?: string }
  excerpt?: string
}

declare global {
  interface Window {
    pagefind?: any
  }
}

async function loadPagefindModule(): Promise<any> {
  // Try multiple known paths where pagefind might be served
  const paths = [
    '/pagefind/pagefind.js',
  ]

  for (const path of paths) {
    try {
      const res = await fetch(path, { method: 'HEAD' })
      if (res.ok) {
        // Use dynamic import via new Function to avoid webpack bundling
        const pf = await new Function(`return import("${path}")`)()
        return pf
      }
    } catch {
      // try next path
    }
  }
  return null
}

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [pagefind, setPagefind] = useState<any>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Load Pagefind on first open
  useEffect(() => {
    if (!open || pagefind || loadFailed) return

    const init = async () => {
      const pf = await loadPagefindModule()
      if (pf) {
        await pf.init()
        setPagefind(pf)
      } else {
        setLoadFailed(true)
        console.warn('Pagefind index not found. Run `npm run build` to generate the search index.')
      }
    }
    init()
  }, [open, pagefind, loadFailed])

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
      setResults([])
    }
  }, [open])

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const search = useCallback(
    async (q: string) => {
      setQuery(q)
      if (!pagefind || q.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const searchResult = await pagefind.search(q)
        const data = await Promise.all(
          searchResult.results.slice(0, 8).map((r: any) => r.data()),
        )
        setResults(
          data.map((d: any) => ({
            url: d.url,
            meta: d.meta,
            excerpt: d.excerpt,
          })),
        )
      } catch {
        setResults([])
      }
      setLoading(false)
    },
    [pagefind],
  )

  const navigate = (url: string) => {
    setOpen(false)
    router.push(url)
  }

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-dark-light px-3 py-1.5 text-sm text-accent-light transition-colors hover:border-accent/50 hover:text-white"
        aria-label="Search"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded bg-dark-light px-1.5 py-0.5 text-xs text-accent-light sm:inline-block">
          {typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent) ? '\u2318' : 'Ctrl'}K
        </kbd>
      </button>

      {/* Dialog overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-xl rounded-xl border border-dark-light bg-dark shadow-2xl">
            {/* Search input */}
            <div className="flex items-center border-b border-dark-light px-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-accent-light" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => search(e.target.value)}
                placeholder="Search docs and resources..."
                className="w-full bg-transparent px-3 py-4 text-white outline-none placeholder:text-accent-light/60"
              />
              <button
                onClick={() => setOpen(false)}
                className="shrink-0 rounded bg-dark-light px-2 py-1 text-xs text-accent-light"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {loading && (
                <div className="px-4 py-8 text-center text-sm text-accent-light">
                  Searching...
                </div>
              )}

              {!loading && query.length >= 2 && results.length === 0 && pagefind && (
                <div className="px-4 py-8 text-center text-sm text-accent-light">
                  No results found for &quot;{query}&quot;
                </div>
              )}

              {!loading && loadFailed && query.length >= 2 && (
                <div className="px-4 py-8 text-center text-sm text-accent-light">
                  Search index not available. Build the site first.
                </div>
              )}

              {results.map((result, i) => (
                <button
                  key={i}
                  onClick={() => navigate(result.url)}
                  className="flex w-full flex-col gap-1 rounded-lg px-4 py-3 text-left transition-colors hover:bg-dark-light"
                >
                  <span className="text-sm font-medium text-white">
                    {result.meta?.title || result.url}
                  </span>
                  {result.excerpt && (
                    <span
                      className="line-clamp-2 text-xs text-accent-light [&_mark]:bg-accent/30 [&_mark]:text-white"
                      dangerouslySetInnerHTML={{ __html: result.excerpt }}
                    />
                  )}
                  <span className="text-xs text-accent-light/50">{result.url}</span>
                </button>
              ))}

              {query.length < 2 && !loading && !loadFailed && (
                <div className="px-4 py-8 text-center text-sm text-accent-light">
                  Type at least 2 characters to search
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
