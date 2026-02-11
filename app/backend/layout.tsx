import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Panel - PixelThreads",
  description: "Manage your 3D product store configuration",
}

export default function BackendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
