"use client"

import { createClient } from "@/lib/supabase/client"
import useSWR, { mutate } from "swr"

interface ModelOption {
  id: string
  model_id: string
  option_key: string
  enabled: boolean
}

interface Model {
  id: string
  name: string
}

const fetcher = async () => {
  const supabase = createClient()
  const [optionsRes, modelsRes] = await Promise.all([
    supabase.from("model_options").select("*").order("model_id"),
    supabase.from("models").select("id, name").order("sort_order"),
  ])
  if (optionsRes.error) throw optionsRes.error
  if (modelsRes.error) throw modelsRes.error
  return {
    options: optionsRes.data as ModelOption[],
    models: modelsRes.data as Model[],
  }
}

const OPTION_LABELS: Record<string, string> = {
  color: "Color Picker",
  file: "File Upload",
  ai: "AI Generation",
  texture: "Full Texture",
}

export default function ModelOptionsManager() {
  const { data, error, isLoading } = useSWR("admin-model-options", fetcher)

  const toggleOption = async (option: ModelOption) => {
    const supabase = createClient()
    await supabase
      .from("model_options")
      .update({ enabled: !option.enabled })
      .eq("id", option.id)
    mutate("admin-model-options")
  }

  if (isLoading) return <p className="text-sm text-gray-400">Loading options...</p>
  if (error) return <p className="text-sm text-red-500">Error: {error.message}</p>

  const { options, models } = data!
  const grouped = models.map((model) => ({
    ...model,
    options: options.filter((o) => o.model_id === model.id),
  }))

  return (
    <div className="space-y-3">
      {grouped.map((model) => (
        <div
          key={model.id}
          className="bg-white border border-gray-200 rounded-lg p-4"
        >
          <p className="text-sm font-medium text-gray-900 mb-3">{model.name}</p>
          <div className="flex flex-wrap gap-2">
            {model.options.map((option) => (
              <button
                key={option.id}
                onClick={() => toggleOption(option)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  option.enabled
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                }`}
              >
                {OPTION_LABELS[option.option_key] || option.option_key}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
