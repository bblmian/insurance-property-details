"use client"

import { Suspense } from "react"
import dynamic from 'next/dynamic';

// 动态导入 QRScanContent 组件，禁用 SSR
const QRScanContent = dynamic(
  () => import('./QRScanContent'),
  { ssr: false }
);

export default function QRScanPage() {
  return <QRScanContent />;
}

