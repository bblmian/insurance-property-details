"use client"
import { Suspense } from "react"
import dynamic from 'next/dynamic';

// 动态导入 NFCScanContent 组件，禁用 SSR
const NFCScanContent = dynamic(
  () => import('./NFCScanContent'),
  { ssr: false }
);

export default function NFCScanPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NFCScanContent />
    </Suspense>
  )
}

