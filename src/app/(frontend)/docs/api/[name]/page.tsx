import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllApiSpecSlugs, getApiSpec } from '@/lib/docs/api-specs'
import { ApiViewer } from '@/components/docs/ApiViewer'
import { DocsLayout } from '@/components/docs/DocsLayout'
import { DocsBreadcrumb } from '@/components/docs/DocsBreadcrumb'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ name: string }>
}

export async function generateStaticParams() {
  return getAllApiSpecSlugs().map((name) => ({ name }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params
  const data = getApiSpec(name)
  if (!data) return { title: 'API Spec Not Found' }
  return {
    title: `${data.title} — CAEPE API Docs`,
    description: `Interactive API reference for the CAEPE ${data.title}`,
  }
}

export default async function ApiSpecPage({ params }: PageProps) {
  const { name } = await params
  const data = getApiSpec(name)
  if (!data) notFound()

  return (
    <DocsLayout>
      <DocsBreadcrumb slug={`api/${name}`} />
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/docs/api"
          className="text-sm text-accent hover:underline"
        >
          &larr; All APIs
        </Link>
        <h1 className="text-2xl font-bold text-white">{data.title}</h1>
      </div>
      <div className="-mx-4 overflow-hidden rounded-lg border border-dark-light sm:-mx-6">
        <ApiViewer specContent={data.specContent} title={data.title} />
      </div>
    </DocsLayout>
  )
}
