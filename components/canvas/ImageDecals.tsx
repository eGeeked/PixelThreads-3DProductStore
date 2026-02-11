"use client"

import { useMemo } from "react"
import { useSnapshot } from "valtio"
import { Decal, useTexture } from "@react-three/drei"
import state from "@/lib/store"

interface ImageDecalProps {
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  side: "front" | "back"
}

function SingleImageDecal({ url, position, rotation, scale, side }: ImageDecalProps) {
  const texture = useTexture(url)

  // Clone and flip the texture horizontally when on the back so text/images
  // read correctly instead of appearing mirrored
  const displayTexture = useMemo(() => {
    if (side === "back") {
      const cloned = texture.clone()
      cloned.repeat.x = -1
      cloned.offset.x = 1
      cloned.needsUpdate = true
      return cloned
    }
    return texture
  }, [texture, side])

  return (
    <Decal
      position={position}
      rotation={rotation}
      scale={scale}
      map={displayTexture}
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
            side={layer.side}
          />
        ))}
    </>
  )
}
