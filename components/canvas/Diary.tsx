"use client"

import { useSnapshot } from "valtio"
import { useFrame } from "@react-three/fiber"
import { Decal, useGLTF, useTexture } from "@react-three/drei"
import { easing } from "maath"
import state from "@/lib/store"
import ImageDecalsGroup from "./ImageDecals"

export default function Diary() {
  const snap = useSnapshot(state)
  const { nodes, materials } = useGLTF("/api/models/low_poly_bookdiary.glb") as any
  const fullTexture = useTexture(snap.fullDecal)

  useFrame((_state, delta) =>
    easing.dampC(materials["Cover"].color, snap.color, 0.25, delta)
  )
  useFrame((_state, delta) =>
    easing.dampC(materials["Join"].color, snap.color, 0.25, delta)
  )

  return (
    <group dispose={null}>
      <group rotation={[-1.571, 0, 0]} scale={0.1}>
        <group rotation={[Math.PI / 2, 1.5, -1.5]} scale={0.015}>
          <group
            position={[0, -11.5, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <group>
              <mesh
                geometry={nodes.Cover_Cover_0.geometry}
                material={materials.Cover}
              >
                {snap.isFullTexture && (
                  <Decal
                    position={[0, 0, 0]}
                    rotation={[0, 1, 0]}
                    scale={3.5}
                    map={fullTexture}
                  />
                )}
                <ImageDecalsGroup
                  position={[-1, 0.5, -0.01]}
                  rotation={[0, 0, 1.5]}
                  scale={[0.7, 0.7, 0.1]}
                />
              </mesh>
            </group>
            <mesh
              geometry={nodes.Cover_Join_0.geometry}
              material={materials.Join}
            >
              {snap.isFullTexture && (
                <Decal
                  position={[0, 0, 0]}
                  rotation={[0, 1, 0]}
                  scale={3}
                  map={fullTexture}
                />
              )}
            </mesh>
          </group>
          <mesh
            geometry={nodes.Pages_Material_0.geometry}
            material={materials.Material}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          />
        </group>
      </group>
    </group>
  )
}
