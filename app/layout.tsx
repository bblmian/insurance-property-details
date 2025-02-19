import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { ErrorBoundary } from '@/components/error-boundary'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: '保险财产标的管理系统',
  description: '用于管理和追踪保险财产标的信息',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh">
      <body>
        <ErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  )
}
