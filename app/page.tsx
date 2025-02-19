'use client'

import Link from "next/link"
import { QrCode, Wifi, UserPlus, PlusCircle, LogOut, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function HomePage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-300">加载中...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full max-w-[390px]">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-800 dark:text-gray-200">{user.email}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">保险标的管理</h1>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/scan/qr" className="group">
            <div className="aspect-square bg-white dark:bg-gray-800 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg group-hover:bg-gray-50 dark:group-hover:bg-gray-700">
              <QrCode className="w-16 h-16 mb-4 text-gray-600 dark:text-gray-300 transition-transform duration-300 ease-in-out group-hover:scale-110" />
              <span className="text-gray-800 dark:text-gray-200 text-base font-medium">扫描二维码</span>
            </div>
          </Link>
          <Link href="/scan/nfc" className="group">
            <div className="aspect-square bg-white dark:bg-gray-800 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg group-hover:bg-gray-50 dark:group-hover:bg-gray-700">
              <Wifi className="w-16 h-16 mb-4 text-gray-600 dark:text-gray-300 transition-transform duration-300 ease-in-out group-hover:scale-110" />
              <span className="text-gray-800 dark:text-gray-200 text-base font-medium">NFC感应</span>
            </div>
          </Link>
          <Link href="/property/new" className="group">
            <div className="aspect-square bg-white dark:bg-gray-800 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg group-hover:bg-gray-50 dark:group-hover:bg-gray-700">
              <PlusCircle className="w-16 h-16 mb-4 text-gray-600 dark:text-gray-300 transition-transform duration-300 ease-in-out group-hover:scale-110" />
              <span className="text-gray-800 dark:text-gray-200 text-base font-medium">新增物料</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

