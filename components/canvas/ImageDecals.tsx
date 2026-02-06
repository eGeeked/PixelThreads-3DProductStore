"use client"

import { useSnapshot } from "valtio"
import { Decal, useTexture } from "@react-three/drei"
import state from "@/lib/store"

interface ImageDecalProps {
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number | [number, number, number]
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

interface ImageDecalsGroupProps {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number | [number, number, number]
}

export default function ImageDecalsGroup({
  position,
  rotation,
  scale,
}: ImageDecalsGroupProps) {
  const snap = useSnapshot(state)

  return (
    <>
      {snap.imageDecals
        .filter((layer) => layer.visible && layer.url)
        .map((layer) => (
          <SingleImageDecal
            key={layer.id}
            url={layer.url}
            position={position}
            rotation={rotation}
            scale={scale}
          />
        ))}
    </>
  )
}
