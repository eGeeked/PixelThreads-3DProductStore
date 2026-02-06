"use client"

import useSWR from "swr"
import { PRINT_LIMITS, IMAGE_LABELS } from "@/lib/constants"
import state from "@/lib/store"

export interface ModelConfig {
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

export interface PrintLimitConfig {
  model_id: string
  max_width_in: number
  max_height_in: number
  max_scale: number
  scale_to_inches: number
  min_dpi: number
}

export interface ModelOptionConfig {
  id: string
  model_id: string
  option_key: string
  enabled: boolean
}

export interface SettingConfig {
  key: string
  value: any
}

export interface AppConfig {
  models: ModelConfig[]
  printLimits: PrintLimitConfig[]
  modelOptions: ModelOptionConfig[]
  settings: SettingConfig[]
}

const fetcher = async (url: string): Promise<AppConfig> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to load config")
  return res.json()
}

let configApplied = false

export function useConfig() {
  const { data, error, isLoading } = useSWR<AppConfig>("/api/config", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  // Apply config to runtime constants once on load
  if (data && !configApplied) {
    configApplied = true

    // Update PRINT_LIMITS from DB
    for (const pl of data.printLimits) {
      PRINT_LIMITS[pl.model_id] = {
        maxWidthIn: Number(pl.max_width_in),
        maxHeightIn: Number(pl.max_height_in),
        maxScale: Number(pl.max_scale),
        scaleToInches: Number(pl.scale_to_inches),
      }
    }

    // Find default model from settings
    const defaultModelSetting = data.settings.find((s) => s.key === "default_model")
    if (defaultModelSetting) {
      const defaultModelId =
        typeof defaultModelSetting.value === "string"
          ? defaultModelSetting.value
          : String(defaultModelSetting.value)
      state.model = defaultModelId
    }

    // Set default color from the default model
    const defaultModel = data.models.find((m) => m.id === state.model)
    if (defaultModel) {
      state.color = defaultModel.default_color

      // Set default image layer from model config
      if (state.imageDecals.length === 1 && state.imageDecals[0].id === "imageA") {
        state.imageDecals[0].url = defaultModel.default_image_url
        state.imageDecals[0].position = defaultModel.default_image_position as [number, number, number]
        state.imageDecals[0].rotation = defaultModel.default_image_rotation as [number, number, number]
        state.imageDecals[0].scale = Number(defaultModel.default_image_scale)
      }
    }
  }

  // Helper: get enabled models as tab objects
  const modelTabs = data
    ? data.models
        .filter((m) => m.enabled)
        .map((m) => ({
          name: m.id,
          icon: m.icon_url,
          helperText: m.name,
        }))
    : null

  // Helper: get enabled options for a model
  const getModelOptions = (modelId: string) => {
    if (!data) return []
    return data.modelOptions
      .filter((o) => o.model_id === modelId && o.enabled)
      .map((o) => o.option_key)
  }

  // Helper: get a setting value
  const getSetting = (key: string, fallback: any = null) => {
    if (!data) return fallback
    const s = data.settings.find((s) => s.key === key)
    return s ? s.value : fallback
  }

  return {
    config: data,
    error,
    isLoading,
    modelTabs,
    getModelOptions,
    getSetting,
  }
}
