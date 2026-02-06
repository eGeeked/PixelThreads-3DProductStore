"use client"

import { useSnapshot } from "valtio"
import { useFrame } from "@react-three/fiber"
import { Decal, useGLTF, useTexture } from "@react-three/drei"
import { easing } from "maath"
import state from "@/lib/store"

export default function Tshirt() {
  const snap = useSnapshot(state)
  const { nodes, materials } = useGLTF("/api/models/tshirt/source/tshirt.glb") as any
  materials["Polo Shirt"].map = null
  materials["Button"].color = { r: 0, g: 0, b: 0 }

  const logoTexture = useTexture(snap.logoDecal)
  const fullTexture = useTexture(snap.fullDecal)

  useFrame((_state, delta) =>
    easing.dampC(materials["Polo Shirt"].color, snap.color, 0.25, delta)
  )

  return (
    <group position={[0, 0.04, -0.0024]} key="poloShirt">
      <mesh
        castShadow
        geometry={nodes.default002.geometry}
        material={materials["Polo Shirt"]}
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
            position={[0.09, 0.14, 0.1]}
            rotation={[0, 0, 0]}
            scale={0.05}
            map={logoTexture}
            map-anisotropy={16}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
      <mesh
        geometry={nodes.default002_1.geometry}
        material={materials.Button}
      />
    </group>
  )
}
