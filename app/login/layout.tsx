import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '登录 - 保险财产标的管理系统',
  description: '登录或注册以使用保险财产标的管理系统',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 