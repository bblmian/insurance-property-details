import Image from "next/image"
import Link from "next/link"
import { MapPin, Shield, Briefcase, ArrowLeft } from "lucide-react"

export default function PropertyDetails({ params }: { params: { method: string; id: string } }) {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full max-w-[390px]">
        <Link
          href="/"
          className="inline-block mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">标的详情</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">ID: {params.id}</p>

          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
            <Image
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80"
              alt="太阳能发电站"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 ease-in-out hover:scale-105"
            />
          </div>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">太阳能发电站</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">绿能科技有限公司</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">业态: 新能源</span>
              <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">电站性质: 光伏发电</span>
            </div>

            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="text-base">风险类别: </span>
              <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm">
                高风险
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-base">营业性质: </span>
              <span className="text-base text-gray-600 dark:text-gray-300">发电及电力供应</span>
            </div>

            <div className="flex items-start space-x-2">
              <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-base">邮寄地址: </span>
                <p className="text-base text-gray-600 dark:text-gray-300">江苏省 苏州市 吴中区</p>
                <p className="text-base text-gray-600 dark:text-gray-300">苏州工业园区星湖街328号创意产业园</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

