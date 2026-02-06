import { proxy } from "valtio"

export interface ImageLayer {
  id: string
  label: string
  url: string
  visible: boolean
}

const state = proxy({
  intro: true,
  color: "#EFBD4E",
  isFullTexture: false,
  fullDecal: "/texture.jpg",
  model: "tshirt",
  imageDecals: [
    {
      id: "imageA",
      label: "Image A",
      url: "/catLogo.png",
      visible: true,
    },
  ] as ImageLayer[],
})

export default state
