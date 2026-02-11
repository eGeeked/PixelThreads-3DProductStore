"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import useSWR, { mutate } from "swr"

interface Model {
  id: string
  name: string
  icon_url: string
  glb_path: string
  default_color: string
  default_image_url: string
  default_image_position: number[]
  default_image_rotation: number[]
  default_image_scale: number
  sort_order: number
  enabled: boolean
}

const fetcher = async () => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("models")
    .select("*")
    .order("sort_order")
  if (error) throw error
  return data as Model[]
}

export default function ModelsManager() {
  const { data: models, error, isLoading } = useSWR("admin-models", fetcher)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Model>>({})
  const [saving, setSaving] = useState(false)

  const startEdit = (model: Model) => {
    setEditing(model.id)
    setForm({ ...model })
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm({})
  }

  const saveModel = async () => {
    if (!editing) return
    setSaving(true)
    const supabase = createClient()

    const updateData = {
      name: form.name,
      icon_url: form.icon_url,
      glb_path: form.glb_path,
      default_color: form.default_color,
      default_image_url: form.default_image_url,
      default_image_position: form.default_image_position,
      default_image_rotation: form.default_image_rotation,
      default_image_scale: form.default_image_scale,
      sort_order: form.sort_order,
      enabled: form.enabled,
      updated_at: new Date().toISOString(),
    }

    await supabase.from("models").update(updateData).eq("id", editing)
    setSaving(false)
    setEditing(null)
    setForm({})
    mutate("admin-models")
  }

  const toggleEnabled = async (model: Model) => {
    const supabase = createClient()
    await supabase
      .from("models")
      .update({ enabled: !model.enabled, updated_at: new Date().toISOString() })
      .eq("id", model.id)
    mutate("admin-models")
  }

  if (isLoading)
    return <p className="text-sm text-gray-400">Loading models...</p>
  if (error)
    return (
      <p className="text-sm text-red-500">
        Error loading models: {error.message}
      </p>
    )

  return (
    <div className="space-y-3">
      {models?.map((model) => (
        <div
          key={model.id}
          className="bg-white border border-gray-200 rounded-lg p-4"
        >
          {editing === model.id ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name || ""}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    ID (read-only)
                  </label>
                  <input
                    type="text"
                    value={model.id}
                    disabled
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm bg-gray-50 text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Icon URL
                  </label>
                  <input
                    type="text"
                    value={form.icon_url || ""}
                    onChange={(e) =>
                      setForm({ ...form, icon_url: e.target.value })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    GLB Path
                  </label>
                  <input
                    type="text"
                    value={form.glb_path || ""}
                    onChange={(e) =>
                      setForm({ ...form, glb_path: e.target.value })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Default Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.default_color || "#EFBD4E"}
                      onChange={(e) =>
                        setForm({ ...form, default_color: e.target.value })
                      }
                      className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.default_color || ""}
                      onChange={(e) =>
                        setForm({ ...form, default_color: e.target.value })
                      }
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Default Image URL
                  </label>
                  <input
                    type="text"
                    value={form.default_image_url || ""}
                    onChange={(e) =>
                      setForm({ ...form, default_image_url: e.target.value })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Default Scale
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.default_image_scale ?? 0.15}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        default_image_scale: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Default Position (JSON array)
                  </label>
                  <input
                    type="text"
                    value={JSON.stringify(form.default_image_position || [0, 0, 0])}
                    onChange={(e) => {
                      try {
                        setForm({
                          ...form,
                          default_image_position: JSON.parse(e.target.value),
                        })
                      } catch {
                        /* ignore parse errors while typing */
                      }
                    }}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Default Rotation (JSON array)
                  </label>
                  <input
                    type="text"
                    value={JSON.stringify(form.default_image_rotation || [0, 0, 0])}
                    onChange={(e) => {
                      try {
                        setForm({
                          ...form,
                          default_image_rotation: JSON.parse(e.target.value),
                        })
                      } catch {
                        /* ignore parse errors while typing */
                      }
                    }}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={form.sort_order ?? 0}
                  onChange={(e) =>
                    setForm({ ...form, sort_order: parseInt(e.target.value) })
                  }
                  className="w-24 px-2 py-1.5 border border-gray-300 rounded text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={saveModel}
                  disabled={saving}
                  className="px-3 py-1.5 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    model.enabled ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                />
                <span className="font-medium text-sm text-gray-900">
                  {model.name}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {model.id}
                </span>
                <span className="text-xs text-gray-400">
                  Scale: {model.default_image_scale}
                </span>
                <div
                  className="w-4 h-4 rounded border border-gray-200"
                  style={{ backgroundColor: model.default_color }}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleEnabled(model)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    model.enabled
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {model.enabled ? "Enabled" : "Disabled"}
                </button>
                <button
                  onClick={() => startEdit(model)}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
