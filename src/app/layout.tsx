import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import 'katex/dist/katex.min.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Linear Algebra ChatGPT',
  description: 'Chat about linear algebra with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
