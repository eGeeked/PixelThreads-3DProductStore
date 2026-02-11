"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface ModelColor {
  id: string
  model_id: string
  color_hex: string
  color_name: string
  sort_order: number
  enabled: boolean
}

interface Model {
  id: string
  name: string
}

export default function ColorsManager() {
  const [models, setModels] = useState<Model[]>([])
  const [colors, setColors] = useState<ModelColor[]>([])
  const [selectedModel, setSelectedModel] = useState("")
  const [newHex, setNewHex] = useState("#000000")
  const [newName, setNewName] = useState("")
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editHex, setEditHex] = useState("")
  const [editName, setEditName] = useState("")

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const [m, c] = await Promise.all([
        supabase.from("models").select("id, name").order("sort_order"),
        supabase.from("model_colors").select("*").order("sort_order"),
      ])
      setModels(m.data ?? [])
      setColors(c.data ?? [])
      if (m.data && m.data.length > 0 && !selectedModel) {
        setSelectedModel(m.data[0].id)
      }
    }
    load()
  }, [selectedModel])

  const filteredColors = colors.filter((c) => c.model_id === selectedModel)

  const handleAdd = async () => {
    if (!newHex || !selectedModel) return
    setSaving(true)
    const supabase = createClient()
    const maxSort = filteredColors.reduce((max, c) => Math.max(max, c.sort_order), 0)
    const { data, error } = await supabase
      .from("model_colors")
      .insert({
        model_id: selectedModel,
        color_hex: newHex,
        color_name: newName || newHex,
        sort_order: maxSort + 1,
        enabled: true,
      })
      .select()
      .single()
    if (data) {
      setColors([...colors, data])
      setNewHex("#000000")
      setNewName("")
    }
    if (error) alert(error.message)
    setSaving(false)
  }

  const handleToggle = async (id: string, enabled: boolean) => {
    const supabase = createClient()
    await supabase.from("model_colors").update({ enabled: !enabled }).eq("id", id)
    setColors(colors.map((c) => (c.id === id ? { ...c, enabled: !enabled } : c)))
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    await supabase.from("model_colors").delete().eq("id", id)
    setColors(colors.filter((c) => c.id !== id))
  }

  const startEdit = (c: ModelColor) => {
    setEditingId(c.id)
    setEditHex(c.color_hex)
    setEditName(c.color_name)
  }

  const saveEdit = async (id: string) => {
    const supabase = createClient()
    await supabase
      .from("model_colors")
      .update({ color_hex: editHex, color_name: editName })
      .eq("id", id)
    setColors(
      colors.map((c) =>
        c.id === id ? { ...c, color_hex: editHex, color_name: editName } : c
      )
    )
    setEditingId(null)
  }

  const handleCopyTo = async (targetModelId: string) => {
    if (!selectedModel || targetModelId === selectedModel) return
    setSaving(true)
    const supabase = createClient()
    const existing = colors.filter((c) => c.model_id === targetModelId)
    const maxSort = existing.reduce((max, c) => Math.max(max, c.sort_order), 0)
    const toCopy = filteredColors.map((c, i) => ({
      model_id: targetModelId,
      color_hex: c.color_hex,
      color_name: c.color_name,
      sort_order: maxSort + i + 1,
      enabled: c.enabled,
    }))
    const { data } = await supabase
      .from("model_colors")
      .upsert(toCopy, { onConflict: "model_id,color_hex" })
      .select()
    if (data) {
      const otherColors = colors.filter((c) => c.model_id !== targetModelId)
      const targetColors = colors.filter(
        (c) => c.model_id === targetModelId && !data.find((d) => d.color_hex === c.color_hex)
      )
      setColors([...otherColors, ...targetColors, ...data])
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Model selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Model:</label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="text-sm border border-gray-200 rounded-md px-3 py-1.5"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        {/* Copy colors to another model */}
        <span className="text-xs text-gray-400 ml-4">Copy to:</span>
        {models
          .filter((m) => m.id !== selectedModel)
          .map((m) => (
            <button
              key={m.id}
              onClick={() => handleCopyTo(m.id)}
              disabled={saving}
              className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              {m.name}
            </button>
          ))}
      </div>

      {/* Add new color */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <input
          type="color"
          value={newHex}
          onChange={(e) => setNewHex(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border-0 p-0"
        />
        <input
          type="text"
          placeholder="#000000"
          value={newHex}
          onChange={(e) => setNewHex(e.target.value)}
          className="text-sm border border-gray-200 rounded-md px-3 py-1.5 w-28 font-mono"
        />
        <input
          type="text"
          placeholder="Color name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="text-sm border border-gray-200 rounded-md px-3 py-1.5 flex-1"
        />
        <button
          onClick={handleAdd}
          disabled={saving || !newHex}
          className="text-sm bg-gray-900 text-white px-4 py-1.5 rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          Add Color
        </button>
      </div>

      {/* Color list */}
      <div className="space-y-2">
        {filteredColors.length === 0 && (
          <p className="text-sm text-gray-400 py-4 text-center">
            No colors defined for this model yet.
          </p>
        )}
        {filteredColors.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg"
          >
            {editingId === c.id ? (
              <>
                <input
                  type="color"
                  value={editHex}
                  onChange={(e) => setEditHex(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={editHex}
                  onChange={(e) => setEditHex(e.target.value)}
                  className="text-xs border border-gray-200 rounded px-2 py-1 w-24 font-mono"
                />
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-xs border border-gray-200 rounded px-2 py-1 flex-1"
                />
                <button
                  onClick={() => saveEdit(c.id)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div
                  className="w-8 h-8 rounded-md border border-gray-200 flex-shrink-0"
                  style={{ backgroundColor: c.color_hex }}
                />
                <span className="text-xs font-mono text-gray-500 w-20">
                  {c.color_hex}
                </span>
                <span className="text-sm text-gray-700 flex-1">{c.color_name}</span>
                <button
                  onClick={() => handleToggle(c.id, c.enabled)}
                  className={`text-xs px-2 py-0.5 rounded ${
                    c.enabled
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {c.enabled ? "Enabled" : "Disabled"}
                </button>
                <button
                  onClick={() => startEdit(c)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
