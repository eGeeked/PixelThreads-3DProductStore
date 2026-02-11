"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import useSWR, { mutate } from "swr"

interface Setting {
  key: string
  value: any
}

const fetcher = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.from("settings").select("*").order("key")
  if (error) throw error
  return data as Setting[]
}

const SETTING_LABELS: Record<string, string> = {
  default_model: "Default Model",
  allow_texture: "Allow Texture Upload",
  max_image_layers: "Max Image Layers",
  min_dpi_warning: "Min DPI Warning Threshold",
}

export default function SettingsManager() {
  const { data: settings, error, isLoading } = useSWR("admin-settings", fetcher)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [saving, setSaving] = useState(false)

  const startEdit = (setting: Setting) => {
    setEditingKey(setting.key)
    setEditValue(
      typeof setting.value === "string"
        ? setting.value
        : JSON.stringify(setting.value)
    )
  }

  const cancelEdit = () => {
    setEditingKey(null)
    setEditValue("")
  }

  const saveSetting = async () => {
    if (!editingKey) return
    setSaving(true)
    const supabase = createClient()

    let parsedValue: any = editValue
    try {
      parsedValue = JSON.parse(editValue)
    } catch {
      // keep as string
    }

    await supabase
      .from("settings")
      .update({ value: parsedValue, updated_at: new Date().toISOString() })
      .eq("key", editingKey)

    setSaving(false)
    setEditingKey(null)
    setEditValue("")
    mutate("admin-settings")
  }

  if (isLoading) return <p className="text-sm text-gray-400">Loading settings...</p>
  if (error) return <p className="text-sm text-red-500">Error: {error.message}</p>

  return (
    <div className="space-y-3">
      {settings?.map((setting) => (
        <div
          key={setting.key}
          className="bg-white border border-gray-200 rounded-lg p-4"
        >
          {editingKey === setting.key ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-900">
                {SETTING_LABELS[setting.key] || setting.key}
              </p>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm font-mono"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={saveSetting}
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
                <span className="font-medium text-sm text-gray-900">
                  {SETTING_LABELS[setting.key] || setting.key}
                </span>
                <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded">
                  {typeof setting.value === "string"
                    ? setting.value
                    : JSON.stringify(setting.value)}
                </span>
              </div>
              <button
                onClick={() => startEdit(setting)}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
