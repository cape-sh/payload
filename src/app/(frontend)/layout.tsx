import React from 'react'
import { Inter } from 'next/font/google'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'CAEPE — Deploy Anywhere, Manage Everything',
  description: 'CAEPE simplifies multi-cluster Kubernetes management with deployment, smoke testing, and edge support.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    images: [{ url: '/images/caepe-og.png', width: 1200, height: 630 }],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-dark font-sans text-white antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
