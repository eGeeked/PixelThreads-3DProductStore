"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { useSnapshot } from "valtio"
import state from "@/lib/store"
import Backdrop from "./Backdrop"
import CameraRig from "./CameraRig"
import Shirt from "./Shirt"
import Tshirt from "./Tshirt"
import Mug from "./Mug"
import Diary from "./Diary"

interface CanvasModelProps {
  mouseMovement: boolean
}

function ModelSwitch() {
  const snap = useSnapshot(state)

  switch (snap.model) {
    case "tshirt":
      return <Shirt key="tshirt" />
    case "poloShirt":
      return <Tshirt key="poloShirt" />
    case "mug":
      return <Mug key="mug" />
    case "diary":
      return <Diary key="diary" />
    default:
      return null
  }
}

export default function CanvasModel({ mouseMovement }: CanvasModelProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full max-w-full h-full transition-all ease-in"
    >
      <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[0, 0, 5]} intensity={0.7} />
      <Environment preset="city" />
      <Suspense fallback={null}>
        <Backdrop />
        <CameraRig rotateWithClick={mouseMovement}>
          <ModelSwitch />
        </CameraRig>
      </Suspense>
    </Canvas>
  )
}
