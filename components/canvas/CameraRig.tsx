"use client"

import { useRef, useState, type ReactNode } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useSnapshot } from "valtio"
import { easing } from "maath"
import state from "@/lib/store"

interface CameraRigProps {
  children: ReactNode
  rotateWithClick: boolean
}

export default function CameraRig({ children, rotateWithClick }: CameraRigProps) {
  const group = useRef<any>(null)
  const snap = useSnapshot(state)
  const three = useThree()

  const [isMouseDown, setIsMouseDown] = useState(false)
  const [prevMouseX, setPrevMouseX] = useState(0)

  const handleMouseDown = (e: any) => {
    setIsMouseDown(true)
    setPrevMouseX(e.clientX)
    updateCursor("grabbing")
  }

  const handleMouseUp = () => {
    setIsMouseDown(false)
    updateCursor("pointer")
  }

  const handleMouseMove = (e: any) => {
    if (isMouseDown && rotateWithClick) {
      const deltaX = e.clientX - prevMouseX
      group.current.rotation.y += deltaX * 0.01
      setPrevMouseX(e.clientX)
    }
  }

  const updateCursor = (cursor: string) => {
    three.gl.domElement.style.cursor = cursor
  }

  useFrame((frameState, delta) => {
    const isBreakpoint = typeof window !== "undefined" && window.innerWidth <= 1260
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 600

    let targetPosition: [number, number, number] = [-0.4, 0, 2]
    if (snap.intro) {
      if (isBreakpoint) targetPosition = [0, 0, 2]
      if (isMobile) targetPosition = [0, 0.2, 2.5]
    } else {
      if (isMobile) targetPosition = [0, 0, 2.5]
      else targetPosition = [0, 0, 2]
    }

    easing.damp3(frameState.camera.position, targetPosition, 0.25, delta)
  })

  return (
    <group
      ref={group}
      onPointerDown={handleMouseDown}
      onPointerUp={handleMouseUp}
      onPointerMove={handleMouseMove}
      onClick={() => setIsMouseDown(false)}
    >
      {children}
    </group>
  )
}
