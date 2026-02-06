import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "PixelThreads - 3D Product Customizer",
  description:
    "Design and customize products in a 3D environment. Unleash your imagination with our 3D customization tool.",
  icons: {
    icon: "/logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#EFBD4E",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
