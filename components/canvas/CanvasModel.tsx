"use client"

import { Canvas } from "@react-three/fiber"
import { Environment, Center } from "@react-three/drei"
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

export default function CanvasModel({ mouseMovement }: CanvasModelProps) {
  const snap = useSnapshot(state)

  const generateModel = () => {
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

  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      className="w-full max-w-full h-full transition-all ease-in"
    >
      <Backdrop />
      <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[0, 0, 5]} intensity={0.7} />
      <Environment preset="city" />
      <CameraRig rotateWithClick={mouseMovement}>
        {generateModel()}
      </CameraRig>
    </Canvas>
  )
}
