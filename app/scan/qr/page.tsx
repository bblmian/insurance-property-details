"use client"

import { Suspense } from "react"
import QRScanContent from "./QRScanContent"

export default function QRScanPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QRScanContent />
    </Suspense>
  )
}

