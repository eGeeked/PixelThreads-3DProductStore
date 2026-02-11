"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import useSWR, { mutate } from "swr"

interface PrintLimit {
  model_id: string
  max_width_in: number
  max_height_in: number
  max_scale: number
  scale_to_inches: number
  min_dpi: number
}

const fetcher = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.from("print_limits").select("*")
  if (error) throw error
  return data as PrintLimit[]
}

export default function PrintLimitsManager() {
  const { data: limits, error, isLoading } = useSWR("admin-print-limits", fetcher)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<PrintLimit>>({})
  const [saving, setSaving] = useState(false)

  const startEdit = (limit: PrintLimit) => {
    setEditing(limit.model_id)
    setForm({ ...limit })
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm({})
  }

  const savePrintLimit = async () => {
    if (!editing) return
    setSaving(true)
    const supabase = createClient()

    await supabase
      .from("print_limits")
      .update({
        max_width_in: form.max_width_in,
        max_height_in: form.max_height_in,
        max_scale: form.max_scale,
        scale_to_inches: form.scale_to_inches,
        min_dpi: form.min_dpi,
      })
      .eq("model_id", editing)

    setSaving(false)
    setEditing(null)
    setForm({})
    mutate("admin-print-limits")
  }

  if (isLoading) return <p className="text-sm text-gray-400">Loading print limits...</p>
  if (error) return <p className="text-sm text-red-500">Error: {error.message}</p>

  return (
    <div className="space-y-3">
      {limits?.map((limit) => (
        <div
          key={limit.model_id}
          className="bg-white border border-gray-200 rounded-lg p-4"
        >
          {editing === limit.model_id ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-900 mb-2">
                {limit.model_id}
              </p>
              <div className="grid grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Max Width (in)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.max_width_in ?? 0}
                    onChange={(e) =>
                      setForm({ ...form, max_width_in: parseFloat(e.target.value) })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Max Height (in)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.max_height_in ?? 0}
                    onChange={(e) =>
                      setForm({ ...form, max_height_in: parseFloat(e.target.value) })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Max Scale
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.max_scale ?? 0}
                    onChange={(e) =>
                      setForm({ ...form, max_scale: parseFloat(e.target.value) })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Scale to Inches
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.scale_to_inches ?? 0}
                    onChange={(e) =>
                      setForm({ ...form, scale_to_inches: parseFloat(e.target.value) })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Min DPI
                  </label>
                  <input
                    type="number"
                    value={form.min_dpi ?? 300}
                    onChange={(e) =>
                      setForm({ ...form, min_dpi: parseInt(e.target.value) })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={savePrintLimit}
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
              <div className="flex items-center gap-4">
                <span className="font-medium text-sm text-gray-900">
                  {limit.model_id}
                </span>
                <span className="text-xs text-gray-500">
                  {limit.max_width_in}" x {limit.max_height_in}"
                </span>
                <span className="text-xs text-gray-500">
                  Max Scale: {limit.max_scale}
                </span>
                <span className="text-xs text-gray-500">
                  Min DPI: {limit.min_dpi}
                </span>
              </div>
              <button
                onClick={() => startEdit(limit)}
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
