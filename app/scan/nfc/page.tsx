"use client"
import { Suspense } from "react"
import NFCScanContent from "./NFCScanContent"

export default function NFCScanPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NFCScanContent />
    </Suspense>
  )
}

