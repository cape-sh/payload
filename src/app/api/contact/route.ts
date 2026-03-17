import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().min(1),
  role: z.string(),
  clusters: z.string(),
  message: z.string().optional(),
  turnstileToken: z.string().min(1, 'Turnstile verification required'),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const { name, email, company, role, clusters, message, turnstileToken } = parsed.data

  // Verify Turnstile token
  if (process.env.TURNSTILE_SECRET_KEY) {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    })

    const verifyData = await verifyRes.json()
    if (!verifyData.success) {
      return NextResponse.json({ error: 'Bot verification failed' }, { status: 400 })
    }
  }

  // Send email via Resend
  const resendKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_FORM_TO

  if (resendKey && toEmail) {
    const resend = new Resend(resendKey)

    await resend.emails.send({
      from: 'CAEPE Demo Request <noreply@caepe.sh>',
      to: toEmail,
      replyTo: email,
      subject: `Demo Request from ${name} at ${company}`,
      html: `
        <h2>New Demo Request</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px;">
          <tr><td style="padding:8px;font-weight:bold;">Name</td><td style="padding:8px;">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Company</td><td style="padding:8px;">${company}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Role</td><td style="padding:8px;">${role}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Clusters</td><td style="padding:8px;">${clusters}</td></tr>
          ${message ? `<tr><td style="padding:8px;font-weight:bold;">Message</td><td style="padding:8px;">${message}</td></tr>` : ''}
        </table>
      `,
    })
  } else {
    console.log('Demo request received (no email adapter configured):', {
      name,
      email,
      company,
      role,
      clusters,
      message,
    })
  }

  return NextResponse.json({ success: true })
}
