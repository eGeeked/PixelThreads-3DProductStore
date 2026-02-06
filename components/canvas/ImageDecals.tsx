"use client"

import { useSnapshot } from "valtio"
import { Decal, useTexture } from "@react-three/drei"
import state from "@/lib/store"

interface ImageDecalProps {
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}

function SingleImageDecal({ url, position, rotation, scale }: ImageDecalProps) {
  const texture = useTexture(url)
  return (
    <Decal
      position={position}
      rotation={rotation}
      scale={scale}
      map={texture}
      map-anisotropy={16}
    />
  )
}

export default function ImageDecalsGroup() {
  const snap = useSnapshot(state)

  return (
    <>
      {snap.imageDecals
        .filter((layer) => layer.visible && layer.url)
        .map((layer) => (
          <SingleImageDecal
            key={layer.id}
            url={layer.url}
            position={layer.position as [number, number, number]}
            rotation={layer.rotation as [number, number, number]}
            scale={layer.scale}
          />
        ))}
    </>
  )
}
