import { proxy } from "valtio"

export interface ImageLayer {
  id: string
  label: string
  url: string
  visible: boolean
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  side: "front" | "back"
  imageWidth: number
  imageHeight: number
}

const state = proxy({
  intro: true,
  color: "#EFBD4E",
  isFullTexture: false,
  fullDecal: "/texture.jpg",
  model: "tshirt",
  selectedLayerId: "imageA" as string | null,
  imageDecals: [
    {
      id: "imageA",
      label: "Image A",
      url: "/catLogo.png",
      visible: true,
      position: [0, 0.04, 0.15] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: 0.15,
      side: "front" as "front" | "back",
      imageWidth: 0,
      imageHeight: 0,
    },
  ] as ImageLayer[],
})

export default state
