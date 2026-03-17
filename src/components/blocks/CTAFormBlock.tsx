import { DemoRequestForm } from '@/components/forms/DemoRequestForm'

interface CTAFormBlockProps {
  headline: string
  subheadline?: string | null
  form_id: 'demo-request' | 'contact' | 'newsletter'
}

export function CTAFormBlock({ headline, subheadline, form_id }: CTAFormBlockProps) {
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">{headline}</h2>
          {subheadline && (
            <p className="mt-4 text-lg text-accent-light">{subheadline}</p>
          )}
        </div>

        <div className="rounded-xl border border-dark-light p-6 md:p-8">
          {form_id === 'demo-request' && <DemoRequestForm />}
          {form_id === 'contact' && <DemoRequestForm />}
          {form_id === 'newsletter' && (
            <p className="text-center text-accent-light">Newsletter signup coming soon.</p>
          )}
        </div>
      </div>
    </section>
  )
}
