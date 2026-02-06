"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Home from "@/components/Home"
import Customizer from "@/components/Customizer"
import CanvasErrorBoundary from "@/components/canvas/CanvasErrorBoundary"

const CanvasModel = dynamic(
  () => import("@/components/canvas/CanvasModel"),
  { ssr: false }
)

export default function Page() {
  const [mouseMovement, setMouseMovement] = useState(false)

  const handleMouseMove = () => {
    setMouseMovement(!mouseMovement)
  }

  return (
    <main className="app transition-all ease-in">
      <Home />
      <CanvasErrorBoundary>
        <CanvasModel mouseMovement={mouseMovement} />
      </CanvasErrorBoundary>
      <Customizer
        mouseMovement={mouseMovement}
        handleMouseMove={handleMouseMove}
      />
    </main>
  )
}
