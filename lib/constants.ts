export const EditorTabs = [
  {
    name: "colorpicker",
    icon: "/assets/swatch.png",
    helperText: "Color",
  },
  {
    name: "filepicker",
    icon: "/assets/file.png",
    helperText: "File",
  },
  {
    name: "aipicker",
    icon: "/assets/ai.png",
    helperText: "AI",
  },
  {
    name: "mouseMovement",
    icon: "/assets/mouse.png",
    helperText: "Mouse",
  },
]

export const FilterTabs = [
  {
    name: "logoShirt",
    icon: "/assets/logo-tshirt.png",
    helperText: "Logo",
  },
  {
    name: "stylishShirt",
    icon: "/assets/stylish-tshirt.png",
    helperText: "Texture",
  },
]

export const modelTabs = [
  {
    name: "tshirt",
    icon: "/assets/logo-tshirt.png",
    helperText: "T-Shirt",
  },
  {
    name: "poloShirt",
    icon: "/assets/polo.png",
    helperText: "Polo",
  },
  {
    name: "mug",
    icon: "/assets/mug.png",
    helperText: "Mug",
  },
  {
    name: "diary",
    icon: "/assets/diary.png",
    helperText: "Diary",
  },
]

export const DecalTypes: Record<
  string,
  { stateProperty: string; filterTab: string }
> = {
  logo: {
    stateProperty: "logoDecal",
    filterTab: "logoShirt",
  },
  full: {
    stateProperty: "fullDecal",
    filterTab: "stylishShirt",
  },
}
