declare module "react-color" {
  import { Component } from "react"

  interface ColorResult {
    hex: string
    rgb: { r: number; g: number; b: number; a: number }
    hsl: { h: number; s: number; l: number; a: number }
  }

  interface ColorPickerProps {
    color?: string | { r: number; g: number; b: number; a?: number }
    onChange?: (color: ColorResult) => void
    onChangeComplete?: (color: ColorResult) => void
    disableAlpha?: boolean
    presetColors?: string[]
    width?: string
    className?: string
    styles?: Record<string, any>
  }

  export class SketchPicker extends Component<ColorPickerProps> {}
  export class ChromePicker extends Component<ColorPickerProps> {}
  export class CompactPicker extends Component<ColorPickerProps> {}
  export class SwatchesPicker extends Component<ColorPickerProps> {}
}
