"use client"

import { useSnapshot } from "valtio"
import state from "@/lib/store"
import { useConfig } from "@/hooks/use-config"

const FALLBACK_COLORS = [
  { hex: "#EFBD4E", name: "Gold" },
  { hex: "#353934", name: "Charcoal" },
  { hex: "#ffffff", name: "White" },
  { hex: "#80C670", name: "Green" },
  { hex: "#726DE8", name: "Purple" },
  { hex: "#2CCCE4", name: "Cyan" },
  { hex: "#ff8a65", name: "Coral" },
  { hex: "#FF96AD", name: "Pink" },
  { hex: "#512314", name: "Brown" },
  { hex: "#1a1a2e", name: "Navy" },
  { hex: "#cc0000", name: "Red" },
  { hex: "#cccccc", name: "Light Gray" },
]

export default function ColorPicker() {
  const snap = useSnapshot(state)
  const { getModelColors } = useConfig()

  const dbColors = getModelColors(snap.model)
  const colors = dbColors.length > 0 ? dbColors : FALLBACK_COLORS

  return (
    <div className="absolute left-full ml-3 glassmorphism p-3 rounded-md w-[200px]">
      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-2">
        Colors
      </p>
      <div className="grid grid-cols-4 gap-2">
        {colors.map((c) => (
          <button
            key={c.hex}
            title={c.name}
            onClick={() => (state.color = c.hex)}
            className="group relative w-10 h-10 rounded-lg border-2 transition-all duration-150 hover:scale-110"
            style={{
              backgroundColor: c.hex,
              borderColor:
                snap.color.toLowerCase() === c.hex.toLowerCase()
                  ? "#111"
                  : c.hex.toLowerCase() === "#ffffff"
                    ? "#ddd"
                    : "transparent",
              boxShadow:
                snap.color.toLowerCase() === c.hex.toLowerCase()
                  ? "0 0 0 2px rgba(0,0,0,0.15)"
                  : "none",
            }}
          >
            {snap.color.toLowerCase() === c.hex.toLowerCase() && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke={c.hex.toLowerCase() === "#ffffff" || c.hex.toLowerCase() === "#cccccc" ? "#333" : "#fff"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3,8 7,12 13,4" />
                </svg>
              </span>
            )}
            <span className="sr-only">{c.name}</span>
          </button>
        ))}
      </div>
      {colors.length > 0 && (
        <p className="text-[9px] text-gray-400 mt-2 text-center">
          {colors.find((c) => c.hex.toLowerCase() === snap.color.toLowerCase())?.name || ""}
        </p>
      )}
    </div>
  )
}
