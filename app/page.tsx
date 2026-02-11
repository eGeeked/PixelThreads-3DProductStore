"use client"

import dynamic from "next/dynamic"
import Home from "@/components/Home"
import Customizer from "@/components/Customizer"
import CanvasErrorBoundary from "@/components/canvas/CanvasErrorBoundary"

const CanvasModel = dynamic(
  () => import("@/components/canvas/CanvasModel"),
  { ssr: false }
)

export default function Page() {
  return (
    <main className="app transition-all ease-in">
      <Home />
      <CanvasErrorBoundary>
        <CanvasModel />
      </CanvasErrorBoundary>
      <Customizer />
    </main>
  )
}
