import Image from "next/image"
import { MapPin } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PropertyDetails() {
  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">标的详情</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
            <Image
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80"
              alt="太阳能发电站"
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold">太阳能发电站</h2>
            <p className="text-sm text-gray-600">绿能科技有限公司</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">业态: 新能源</Badge>
            <Badge variant="secondary">电站性质: 光伏发电</Badge>
          </div>

          <div>
            <p className="text-sm font-medium">风险类别</p>
            <Badge variant="destructive">高风险</Badge>
          </div>

          <div>
            <p className="text-sm font-medium">营业性质</p>
            <p className="text-sm">发电及电力供应</p>
          </div>

          <div className="flex items-start space-x-2">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium">邮寄地址</p>
              <p className="text-sm">江苏省 苏州市 吴中区</p>
              <p className="text-sm text-gray-600">苏州工业园区星湖街328号创意产业园</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

