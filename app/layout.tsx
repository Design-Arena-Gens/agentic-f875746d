import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Meme Coin Tracker - Rug Pull Scanner',
  description: 'Track new meme coins and analyze rug pull risks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
