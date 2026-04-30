import AppLayout from '@/components/layout/AppLayout'
import { Toaster } from 'sonner'
import React from 'react'

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppLayout>{children}</AppLayout>
      <Toaster position="top-right" richColors />
    </>
  )
}

export default PublicLayout