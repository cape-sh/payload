'use client'

import { ApiReferenceReact } from '@scalar/api-reference-react'
import '@scalar/api-reference-react/style.css'

interface ApiViewerProps {
  specContent: string
  title: string
}

export function ApiViewer({ specContent, title }: ApiViewerProps) {
  return (
    <div className="api-viewer">
      <ApiReferenceReact
        configuration={{
          content: specContent,
          hideModels: false,
          darkMode: true,
          theme: 'deepSpace',
          metaData: { title: `${title} — CAEPE API` },
          hideDownloadButton: false,
          showSidebar: true,
          _integration: 'nextjs',
        }}
      />
    </div>
  )
}
