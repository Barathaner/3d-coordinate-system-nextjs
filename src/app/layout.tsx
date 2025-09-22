import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '3D Coordinate System - PCA Visualization',
  description: 'Interactive 3D visualization of PCA data with labels, time steps, and animations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}