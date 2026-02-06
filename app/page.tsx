"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Home from "@/components/Home"
import Customizer from "@/components/Customizer"

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
      <CanvasModel mouseMovement={mouseMovement} />
      <Customizer
        mouseMovement={mouseMovement}
        handleMouseMove={handleMouseMove}
      />
    </main>
  )
}
