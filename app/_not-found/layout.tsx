import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404: 页面未找到',
  description: '抱歉，您访问的页面不存在。',
}

export default function NotFoundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 