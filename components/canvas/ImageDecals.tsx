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

  // Aspect-ratio-aware scale so the decal projection box always matches
  // the image proportions — prevents clipping at any scale.
  const decalScale = useMemo((): [number, number, number] => {
    const img = texture.image as HTMLImageElement | undefined
    if (img && img.naturalWidth && img.naturalHeight) {
      const aspect = img.naturalWidth / img.naturalHeight
      if (aspect >= 1) {
        // Landscape or square: width = scale, height = scale / aspect
        return [scale, scale / aspect, 1]
      } else {
        // Portrait: height = scale, width = scale * aspect
        return [scale * aspect, scale, 1]
      }
    }
    // Fallback: square
    return [scale, scale, 1]
  }, [texture, scale])

  return (
    <Decal
      position={position}
      rotation={rotation}
      scale={decalScale}
      map={displayTexture}
      map-anisotropy={16}
      depthTest={false}
      polygonOffsetFactor={-1}
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
