'use client'

import { BusinessDataProvider } from '@/contexts/BusinessDataContext'

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BusinessDataProvider>
      {children}
    </BusinessDataProvider>
  )
}

