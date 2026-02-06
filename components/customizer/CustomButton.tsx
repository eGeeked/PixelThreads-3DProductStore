"use client"

import { useSnapshot } from "valtio"
import state from "@/lib/store"
import { getContrastingColor } from "@/lib/helpers"

interface CustomButtonProps {
  type: "filled" | "outline"
  title: string
  customStyles?: string
  handleClick?: () => void
}

export default function CustomButton({
  type,
  title,
  customStyles = "",
  handleClick,
}: CustomButtonProps) {
  const snap = useSnapshot(state)

  const generateStyles = (buttonType: string) => {
    if (buttonType === "filled") {
      return {
        backgroundColor: snap.color,
        color: getContrastingColor(snap.color),
      }
    } else if (buttonType === "outline") {
      return {
        borderWidth: "1px",
        borderColor: snap.color,
        color: snap.color,
      }
    }
    return {}
  }

  return (
    <button
      className={`px-2 py-1.5 flex-1 rounded-md ${customStyles}`}
      style={generateStyles(type)}
      onClick={handleClick}
    >
      {title}
    </button>
  )
}
