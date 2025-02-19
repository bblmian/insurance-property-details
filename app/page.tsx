import Link from "next/link"
import { QrCode, Wifi, UserPlus, PlusCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full max-w-[390px]">
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
          <Link href="/register" className="group">
            <div className="aspect-square bg-white dark:bg-gray-800 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg group-hover:bg-gray-50 dark:group-hover:bg-gray-700">
              <UserPlus className="w-16 h-16 mb-4 text-gray-600 dark:text-gray-300 transition-transform duration-300 ease-in-out group-hover:scale-110" />
              <span className="text-gray-800 dark:text-gray-200 text-base font-medium">用户注册</span>
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

