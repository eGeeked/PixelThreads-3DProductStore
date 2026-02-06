"use client"

import { Suspense, useEffect } from "react"
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
  useEffect(() => {
    fetch("/shirt_baked.glb").then(res => {
      console.log("[v0] GLB fetch status:", res.status, "content-type:", res.headers.get("content-type"), "url:", res.url)
      return res.arrayBuffer()
    }).then(buf => {
      const arr = new Uint8Array(buf)
      const magic = String.fromCharCode(arr[0], arr[1], arr[2], arr[3])
      console.log("[v0] GLB first 4 bytes (magic):", magic, "size:", buf.byteLength)
    }).catch(e => console.log("[v0] GLB fetch error:", e))
  }, [])

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
