import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AqarLens | AI real-estate intelligence',
  description:
    'Explore Egyptian real-estate projects, developers, locations, investment metrics, amenities, and AI-powered comparisons.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
