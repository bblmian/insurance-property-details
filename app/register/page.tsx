"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Phone, Camera, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [avatar, setAvatar] = useState("/default-avatar.svg")
  const router = useRouter()

  const handleWechatRegister = () => {
    setUsername("微信用户")
    setPhoneNumber("13800138000")
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("注册信息:", { username, phoneNumber, avatar })
    router.push("/")
  }

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
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">用户注册</h2>
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 mb-4">
              <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {avatar === "/default-avatar.svg" ? (
                  <User className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                ) : (
                  <img src={avatar || "/placeholder.svg"} alt="用户头像" className="w-full h-full object-cover" />
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-gray-900 dark:bg-gray-100 rounded-full p-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-white dark:text-gray-900" />
              </label>
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
            <button
              onClick={handleWechatRegister}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-colors duration-300 mb-4 flex items-center text-base"
            >
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.75 13.5C7.75 13.5 7 12.75 7 11.75C7 10.75 7.75 10 8.75 10C9.75 10 10.5 10.75 10.5 11.75C10.5 12.75 9.75 13.5 8.75 13.5ZM15.25 13.5C14.25 13.5 13.5 12.75 13.5 11.75C13.5 10.75 14.25 10 15.25 10C16.25 10 17 10.75 17 11.75C17 12.75 16.25 13.5 15.25 13.5ZM22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C13.45 22 14.85 21.72 16.15 21.22L19.78 22.94C20.09 23.08 20.45 22.95 20.59 22.64C20.65 22.51 20.67 22.37 20.64 22.23L19.73 18.73C21.17 17.03 22 14.61 22 12ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 14.08 19.32 16.03 18.12 17.57L17.67 18.18L18.24 20.43L16.02 19.39L15.41 19.62C14.38 20.01 13.21 20.21 12 20.21V20Z" />
              </svg>
              使用微信账号注册
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600" />
              <input
                type="text"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-3 pl-10 pr-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 text-base"
                required
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600" />
              <input
                type="tel"
                placeholder="手机号码"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full py-3 pl-10 pr-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 text-base"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-semibold rounded-lg transition-colors duration-300 text-base"
            >
              注册
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

