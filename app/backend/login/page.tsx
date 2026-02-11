"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [seedStatus, setSeedStatus] = useState("")
  const [seeding, setSeeding] = useState(false)
  const router = useRouter()

  const handleSeedAdmin = async () => {
    setSeeding(true)
    setSeedStatus("")
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setSeedStatus(data.message || "Admin created! You can now sign in.")
        setEmail("jordanmanders@gmail.com")
      } else {
        setSeedStatus(data.error || "Failed to create admin")
      }
    } catch (err: unknown) {
      setSeedStatus(err instanceof Error ? err.message : "Network error")
    }
    setSeeding(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push("/backend")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900 mb-1 text-center">
            Admin Panel
          </h1>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Sign in to manage your store
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-[11px] text-gray-400 text-center mb-2">
              First time? Set up the admin account.
            </p>
            <button
              onClick={handleSeedAdmin}
              disabled={seeding}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-xs font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {seeding ? "Setting up..." : "Initialize Admin Account"}
            </button>
            {seedStatus && (
              <p className="text-xs text-center mt-2 text-gray-500">
                {seedStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
