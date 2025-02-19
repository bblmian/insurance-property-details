"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Camera, MapPin, QrCode, Wifi } from "lucide-react"

export default function NewPropertyPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    businessType: "",
    stationType: "",
    riskLevel: "",
    businessNature: "",
    province: "",
    city: "",
    district: "",
    address: "",
    serialCode: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleScanCode = (method: "qr" | "nfc") => {
    router.push(`/scan/${method}?returnTo=/property/new`)
  }

  useEffect(() => {
    const serialCode = localStorage.getItem("scannedSerialCode")
    if (serialCode) {
      setFormData((prev) => ({ ...prev, serialCode }))
      localStorage.removeItem("scannedSerialCode")
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("提交的数据:", formData)
    // 这里应该添加实际的提交逻辑
    router.push("/property/details/new-id") // 假设提交后跳转到详情页
  }

  const handleWechatLocation = () => {
    // 这里应该是调用微信SDK的地理位置API
    console.log("调用微信地理位置API")
    // 模拟获取位置信息
    setFormData((prev) => ({
      ...prev,
      province: "浙江省",
      city: "杭州市",
      district: "西湖区",
      address: "文三路 478 号",
    }))
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md mx-auto p-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Link>
        <h1 className="text-2xl font-bold mt-6 mb-6 text-gray-900 dark:text-gray-100">新增物料</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              项目名称
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              所属公司
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              业态
            </label>
            <input
              type="text"
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label htmlFor="stationType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              电站性质
            </label>
            <input
              type="text"
              id="stationType"
              name="stationType"
              value={formData.stationType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label htmlFor="riskLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              风险类别
            </label>
            <select
              id="riskLevel"
              name="riskLevel"
              value={formData.riskLevel}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              required
            >
              <option value="">请选择</option>
              <option value="low">低风险</option>
              <option value="medium">中风险</option>
              <option value="high">高风险</option>
            </select>
          </div>
          <div>
            <label htmlFor="businessNature" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              营业性质
            </label>
            <input
              type="text"
              id="businessNature"
              name="businessNature"
              value={formData.businessNature}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              required
            />
          </div>
          <div className="relative">
            <input
              type="text"
              id="serialCode"
              name="serialCode"
              value={formData.serialCode}
              onChange={handleInputChange}
              className="w-full py-3 pr-20 pl-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 text-base"
              placeholder="财产标的序列码"
              required
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
              <button
                type="button"
                onClick={() => handleScanCode("qr")}
                className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                <QrCode className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                type="button"
                onClick={() => handleScanCode("nfc")}
                className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                <Wifi className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">邮寄地址</label>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <input
                type="text"
                name="province"
                placeholder="省份"
                value={formData.province}
                onChange={handleInputChange}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                required
              />
              <input
                type="text"
                name="city"
                placeholder="城市"
                value={formData.city}
                onChange={handleInputChange}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <input
                type="text"
                name="district"
                placeholder="区县"
                value={formData.district}
                onChange={handleInputChange}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                required
              />
              <button
                type="button"
                onClick={handleWechatLocation}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <MapPin className="w-4 h-4 mr-2" />
                获取位置
              </button>
            </div>
            <input
              type="text"
              name="address"
              placeholder="详细地址"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              项目外观照片
            </label>
            <div className="mt-1 flex items-center">
              <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                <Camera className="h-full w-full text-gray-300 dark:text-gray-600" />
              </span>
              <button
                type="button"
                className="ml-5 bg-white dark:bg-gray-800 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                上传照片
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              提交
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

