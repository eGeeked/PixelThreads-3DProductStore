"use client"

import { useRef } from "react"
import { AccumulativeShadows, RandomizedLight } from "@react-three/drei"

export default function Backdrop() {
  const shadows = useRef(null)
  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.85}
      scale={4}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.14]}
    >
      <RandomizedLight
        amount={4}
        radius={10}
        intensity={1.4}
        ambient={0.25}
        position={[5, 5, -9]}
      />
      <RandomizedLight
        amount={4}
        radius={12}
        intensity={1.4}
        ambient={0.55}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  )
}
