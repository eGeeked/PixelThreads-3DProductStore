"use client"

import { useSnapshot } from "valtio"
import { useFrame } from "@react-three/fiber"
import { Decal, useGLTF, useTexture } from "@react-three/drei"
import { easing } from "maath"
import state from "@/lib/store"

export default function Shirt() {
  const snap = useSnapshot(state)
  const { nodes, materials } = useGLTF("/api/models/shirt_baked.glb") as any

  const logoTexture = useTexture(snap.logoDecal)
  const fullTexture = useTexture(snap.fullDecal)

  useFrame((_state, delta) =>
    easing.dampC(materials.lambert1.color, snap.color, 0.25, delta)
  )

  return (
    <group key="tshirt" position={[0, 0.04, -0.0024]}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {snap.isFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
            depthTest={true}
            depthWrite={true}
          />
        )}
        {snap.isLogoTexture && (
          <Decal
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
            map-anisotropy={16}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  )
}
