"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import AdminHeader from "@/components/admin/AdminHeader"
import ModelsManager from "@/components/admin/ModelsManager"
import PrintLimitsManager from "@/components/admin/PrintLimitsManager"
import ModelOptionsManager from "@/components/admin/ModelOptionsManager"
import SettingsManager from "@/components/admin/SettingsManager"

type Tab = "models" | "print" | "options" | "settings"

export default function BackendPage() {
  const [activeTab, setActiveTab] = useState<Tab>("models")
  const [seeding, setSeeding] = useState(false)
  const [seedStatus, setSeedStatus] = useState("")
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setIsAdmin(false)
        return
      }
      const { data } = await supabase
        .from("admin_profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()
      setIsAdmin(data?.is_admin ?? false)
    }
    checkAdmin()
  }, [])

  const handleSeedAdmin = async () => {
    setSeeding(true)
    setSeedStatus("")
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" })
      const data = await res.json()
      setSeedStatus(data.message || data.error || "Done")
    } catch (err: any) {
      setSeedStatus(err.message)
    }
    setSeeding(false)
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Checking access...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500">
            You do not have admin access.
          </p>
          <button
            onClick={handleSeedAdmin}
            disabled={seeding}
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {seeding ? "Setting up..." : "Initialize Admin Account"}
          </button>
          {seedStatus && (
            <p className="text-xs text-gray-500">{seedStatus}</p>
          )}
        </div>
      </div>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "models", label: "Models" },
    { id: "print", label: "Print Limits" },
    { id: "options", label: "Model Options" },
    { id: "settings", label: "Settings" },
  ]

  return (
    <>
      <AdminHeader />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Tab navigation */}
        <nav className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <div>
          {activeTab === "models" && (
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  3D Models
                </h2>
                <p className="text-sm text-gray-500">
                  Manage available product models, their defaults, and
                  positioning.
                </p>
              </div>
              <ModelsManager />
            </section>
          )}

          {activeTab === "print" && (
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Print Limits
                </h2>
                <p className="text-sm text-gray-500">
                  Set maximum print dimensions, scale constraints, and DPI
                  thresholds per model.
                </p>
              </div>
              <PrintLimitsManager />
            </section>
          )}

          {activeTab === "options" && (
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Model Options
                </h2>
                <p className="text-sm text-gray-500">
                  Toggle which editor features are available for each model.
                </p>
              </div>
              <ModelOptionsManager />
            </section>
          )}

          {activeTab === "settings" && (
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Global Settings
                </h2>
                <p className="text-sm text-gray-500">
                  Configure global application behavior.
                </p>
              </div>
              <SettingsManager />
            </section>
          )}
        </div>
      </main>
    </>
  )
}
