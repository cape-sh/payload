'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Turnstile } from '@marsidev/react-turnstile'
import { useState, useRef } from 'react'

const schema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid work email is required'),
  company: z.string().min(1, 'Company is required'),
  role: z.enum(['DevOps Engineer', 'Platform Engineer', 'Engineering Manager', 'Other']),
  clusters: z.enum(['<10', '10-25', '25-100', '100+']),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function DemoRequestForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const turnstileToken = useRef<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: 'DevOps Engineer',
      clusters: '<10',
    },
  })

  const onSubmit = async (data: FormData) => {
    if (!turnstileToken.current) {
      setServerError('Please complete the verification challenge.')
      return
    }

    setSubmitting(true)
    setServerError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          turnstileToken: turnstileToken.current,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Something went wrong. Please try again.')
      }

      setSubmitted(true)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-green bg-green/10 p-8 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4 text-green">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className="text-xl font-bold text-white">Thank you!</h3>
        <p className="mt-2 text-accent-light">
          We&apos;ve received your request and will be in touch within 24 hours.
        </p>
      </div>
    )
  }

  const inputClass =
    'w-full rounded-lg border border-dark-light bg-dark-light px-4 py-3 text-sm text-white placeholder:text-accent-light/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent'
  const labelClass = 'mb-1 block text-sm font-medium text-accent-light'
  const errorClass = 'mt-1 text-xs text-red-400'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="name" className={labelClass}>Full Name *</label>
        <input id="name" {...register('name')} placeholder="Jane Doe" className={inputClass} />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Work Email *</label>
        <input id="email" type="email" {...register('email')} placeholder="jane@company.com" className={inputClass} />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="company" className={labelClass}>Company *</label>
        <input id="company" {...register('company')} placeholder="Acme Corp" className={inputClass} />
        {errors.company && <p className={errorClass}>{errors.company.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="role" className={labelClass}>Role</label>
          <select id="role" {...register('role')} className={inputClass}>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Platform Engineer">Platform Engineer</option>
            <option value="Engineering Manager">Engineering Manager</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="clusters" className={labelClass}>Number of Clusters</label>
          <select id="clusters" {...register('clusters')} className={inputClass}>
            <option value="<10">&lt;10</option>
            <option value="10-25">10-25</option>
            <option value="25-100">25-100</option>
            <option value="100+">100+</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>Message (optional)</label>
        <textarea
          id="message"
          {...register('message')}
          rows={3}
          placeholder="Tell us about your use case..."
          className={inputClass}
        />
      </div>

      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          onSuccess={(token) => { turnstileToken.current = token }}
          options={{ theme: 'dark' }}
        />
      )}

      {serverError && (
        <p className="rounded bg-red-500/10 px-4 py-2 text-sm text-red-400">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-accent-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent disabled:opacity-50"
      >
        {submitting ? 'Sending...' : 'Request a Demo'}
      </button>
    </form>
  )
}
