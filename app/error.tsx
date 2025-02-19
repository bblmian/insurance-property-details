'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
            出错了
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            抱歉，发生了一些错误。
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error.message}
            </p>
          )}
        </div>
        
        <div className="mt-8 space-y-4">
          <button
            onClick={reset}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600"
          >
            重试
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Link>
        </div>
      </div>
    </main>
  )
} 