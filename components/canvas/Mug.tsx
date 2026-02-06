"use client"

import { useSnapshot } from "valtio"
import { useFrame } from "@react-three/fiber"
import { Decal, useGLTF, useTexture } from "@react-three/drei"
import { easing } from "maath"
import state from "@/lib/store"
import ImageDecalsGroup from "./ImageDecals"

export default function Mug() {
  const snap = useSnapshot(state)
  const { nodes, materials } = useGLTF("/api/models/mug.glb") as any
  const fullTexture = useTexture(snap.fullDecal)

  useFrame((_state, delta) =>
    easing.dampC(materials["Material.001"].color, snap.color, 0.25, delta)
  )

  return (
    <group dispose={null}>
      <mesh
        geometry={nodes.Object_2.geometry}
        material={materials["Material.001"]}
        rotation={[-Math.PI / 2, 0, 1.5]}
        position={[0, -0.2, 0]}
        scale={2}
      >
        {snap.isFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 1, 0]}
            scale={0.5}
            map={fullTexture}
          />
        )}
        <ImageDecalsGroup />
      </mesh>
    </group>
  )
}
