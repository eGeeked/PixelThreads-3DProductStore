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

  const axisLabels = ["X", "Y", "Z"]

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

      <div className="mb-2">
        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
          Position
        </p>
        {axisLabels.map((label, i) => (
          <div key={`pos-${label}`} className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] text-gray-400 w-3 font-mono">
              {label}
            </span>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.01}
              value={layer.position[i]}
              onChange={(e) =>
                updatePosition(i as 0 | 1 | 2, parseFloat(e.target.value))
              }
              className="flex-1 h-1 accent-gray-800"
            />
            <span className="text-[10px] text-gray-500 w-8 text-right font-mono">
              {layer.position[i].toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-2">
        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1">
          Rotation
        </p>
        {axisLabels.map((label, i) => (
          <div key={`rot-${label}`} className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] text-gray-400 w-3 font-mono">
              {label}
            </span>
            <input
              type="range"
              min={-3.14}
              max={3.14}
              step={0.05}
              value={layer.rotation[i]}
              onChange={(e) =>
                updateRotation(i as 0 | 1 | 2, parseFloat(e.target.value))
              }
              className="flex-1 h-1 accent-gray-800"
            />
            <span className="text-[10px] text-gray-500 w-8 text-right font-mono">
              {layer.rotation[i].toFixed(2)}
            </span>
          </div>
        ))}
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
