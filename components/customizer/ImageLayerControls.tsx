"use client"

import { useSnapshot } from "valtio"
import state from "@/lib/store"

export default function ImageLayerControls() {
  const snap = useSnapshot(state)
  const layer = snap.imageDecals.find((l) => l.id === snap.selectedLayerId)

  if (!layer) return null

  const stateLayer = state.imageDecals.find(
    (l) => l.id === snap.selectedLayerId
  )
  if (!stateLayer) return null

  const updatePosition = (axis: 0 | 1 | 2, value: number) => {
    stateLayer.position[axis] = value
  }

  const updateRotation = (axis: 0 | 1 | 2, value: number) => {
    stateLayer.rotation[axis] = value
  }

  const updateScale = (value: number) => {
    stateLayer.scale = value
  }



  const handleToggleSide = () => {
    const newSide = stateLayer.side === "front" ? "back" : "front"
    stateLayer.side = newSide
    // Flip Z position to place on opposite side
    stateLayer.position[2] = newSide === "front"
      ? Math.abs(stateLayer.position[2])
      : -Math.abs(stateLayer.position[2])
  }

  const handleToggleVisibility = () => {
    stateLayer.visible = !stateLayer.visible
  }

  const handleRemove = () => {
    const index = state.imageDecals.findIndex((l) => l.id === snap.selectedLayerId)
    if (index > -1) {
      state.imageDecals.splice(index, 1)
      state.selectedLayerId = state.imageDecals.length > 0
        ? state.imageDecals[state.imageDecals.length - 1].id
        : null
    }
  }

  const handleClose = () => {
    state.selectedLayerId = null
  }

  return (
    <div className="imagelayer-controls">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-700">
          {layer.label}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleVisibility}
            className="text-[10px] px-1.5 py-0.5 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
            title={layer.visible ? "Hide" : "Show"}
          >
            {layer.visible ? "Visible" : "Hidden"}
          </button>
          {snap.imageDecals.length > 1 && (
            <button
              onClick={handleRemove}
              className="text-[10px] px-1.5 py-0.5 rounded border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
              title="Remove layer"
            >
              Remove
            </button>
          )}
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 ml-1 text-sm leading-none"
            title="Close"
          >
            x
          </button>
        </div>
      </div>

      {/* Front / Back toggle */}
      <div className="mb-2">
        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
          Placement
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => { if (layer.side !== "front") handleToggleSide() }}
            className={`flex-1 text-[10px] py-1 rounded border transition-colors ${
              layer.side === "front"
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Front
          </button>
          <button
            onClick={() => { if (layer.side !== "back") handleToggleSide() }}
            className={`flex-1 text-[10px] py-1 rounded border transition-colors ${
              layer.side === "back"
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Back
          </button>
        </div>
      </div>

      {/* Move: horizontal (X), vertical (Y), rotate (Z) */}
      <div className="mb-2">
        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
          Move
        </p>
        {/* Horizontal (X position) - invert when on back */}
        <div className="flex items-center gap-1.5 mb-1">
          <svg width="12" height="12" viewBox="0 0 16 16" className="text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="1" y1="8" x2="15" y2="8" />
            <polyline points="3,5.5 1,8 3,10.5" />
            <polyline points="13,5.5 15,8 13,10.5" />
          </svg>
          <input
            type="range"
            min={-1}
            max={1}
            step={0.01}
            value={layer.side === "back" ? -layer.position[0] : layer.position[0]}
            onChange={(e) => {
              const raw = parseFloat(e.target.value)
              updatePosition(0, layer.side === "back" ? -raw : raw)
            }}
            className="flex-1 h-1 accent-gray-800"
          />
          <span className="text-[10px] text-gray-500 w-8 text-right font-mono">
            {layer.position[0].toFixed(2)}
          </span>
        </div>
        {/* Vertical (Y position) */}
        <div className="flex items-center gap-1.5 mb-1">
          <svg width="12" height="12" viewBox="0 0 16 16" className="text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="8" y1="1" x2="8" y2="15" />
            <polyline points="5.5,3 8,1 10.5,3" />
            <polyline points="5.5,13 8,15 10.5,13" />
          </svg>
          <input
            type="range"
            min={-1}
            max={1}
            step={0.01}
            value={layer.position[1]}
            onChange={(e) => updatePosition(1, parseFloat(e.target.value))}
            className="flex-1 h-1 accent-gray-800"
          />
          <span className="text-[10px] text-gray-500 w-8 text-right font-mono">
            {layer.position[1].toFixed(2)}
          </span>
        </div>
        {/* Rotate (Z rotation) */}
        <div className="flex items-center gap-1.5 mb-1">
          <svg width="12" height="12" viewBox="0 0 16 16" className="text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12.5 8a4.5 4.5 0 1 1-1.3-3.2" />
            <polyline points="12.5,2 12.5,5 9.5,5" />
          </svg>
          <input
            type="range"
            min={-3.14}
            max={3.14}
            step={0.05}
            value={layer.rotation[2]}
            onChange={(e) => updateRotation(2, parseFloat(e.target.value))}
            className="flex-1 h-1 accent-gray-800"
          />
          <span className="text-[10px] text-gray-500 w-8 text-right font-mono">
            {layer.rotation[2].toFixed(2)}
          </span>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
          Scale
        </p>
        <div className="flex items-center gap-1.5">
          <input
            type="range"
            min={0.01}
            max={1}
            step={0.01}
            value={layer.scale}
            onChange={(e) => updateScale(parseFloat(e.target.value))}
            className="flex-1 h-1 accent-gray-800"
          />
          <span className="text-[10px] text-gray-500 w-8 text-right font-mono">
            {layer.scale.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
