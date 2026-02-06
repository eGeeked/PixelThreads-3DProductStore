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
  full: {
    stateProperty: "fullDecal",
    filterTab: "stylishShirt",
  },
}

export const IMAGE_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

// Print area limits per model in inches, and the 3D scale that maps to max print size
// maxScale is the decal scale value that corresponds to the max print dimension
// Mutable at runtime - overwritten by Supabase config on load
export const PRINT_LIMITS: Record<
  string,
  { maxWidthIn: number; maxHeightIn: number; maxScale: number; scaleToInches: number }
> = {
  tshirt: { maxWidthIn: 14, maxHeightIn: 18, maxScale: 0.40, scaleToInches: 14 / 0.40 },
  poloShirt: { maxWidthIn: 14, maxHeightIn: 18, maxScale: 0.12, scaleToInches: 14 / 0.12 },
  mug: { maxWidthIn: 9, maxHeightIn: 4, maxScale: 0.12, scaleToInches: 9 / 0.12 },
  diary: { maxWidthIn: 6, maxHeightIn: 8, maxScale: 1.5, scaleToInches: 6 / 1.5 },
}

export const MIN_DPI = 300
