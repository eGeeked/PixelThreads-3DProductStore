import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = await createClient()

  const [modelsRes, printRes, optionsRes, settingsRes] = await Promise.all([
    supabase.from("models").select("*").order("sort_order"),
    supabase.from("print_limits").select("*"),
    supabase.from("model_options").select("*"),
    supabase.from("settings").select("*"),
  ])

  return NextResponse.json({
    models: modelsRes.data ?? [],
    printLimits: printRes.data ?? [],
    modelOptions: optionsRes.data ?? [],
    settings: settingsRes.data ?? [],
  })
}
