"use client"

import { Suspense, useEffect, useState } from "react"
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
  const [debugInfo, setDebugInfo] = useState("")

  useEffect(() => {
    // Debug: test fetching the GLB file to see what we actually get back
    fetch("/shirt_baked.glb").then(async (res) => {
      const contentType = res.headers.get("content-type") || "unknown"
      const buf = await res.arrayBuffer()
      const bytes = new Uint8Array(buf)
      const first4 = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3])
      const info = `status=${res.status} type=${contentType} size=${buf.byteLength} magic="${first4}"`
      console.log("[v0] GLB direct fetch:", info)
      setDebugInfo(info)
    }).catch(e => {
      console.log("[v0] GLB direct fetch error:", e)
      setDebugInfo("fetch error: " + e.message)
    })

    // Also test the API route
    fetch("/api/models/shirt_baked.glb").then(async (res) => {
      const contentType = res.headers.get("content-type") || "unknown"
      const buf = await res.arrayBuffer()
      const bytes = new Uint8Array(buf)
      const first4 = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3])
      console.log("[v0] GLB API route fetch: status=" + res.status, "type=" + contentType, "size=" + buf.byteLength, 'magic="' + first4 + '"')
    }).catch(e => {
      console.log("[v0] GLB API route fetch error:", e)
    })
  }, [])

  console.log("[v0] CanvasModel rendering, debugInfo:", debugInfo)

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
