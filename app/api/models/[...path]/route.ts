import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params

  // Try multiple locations: the git-tracked client/public first, then public/
  const locations = [
    join(process.cwd(), "client", "public", ...path),
    join(process.cwd(), "public", ...path),
  ]

  let filePath: string | null = null
  for (const loc of locations) {
    if (existsSync(loc)) {
      filePath = loc
      break
    }
  }

  if (!filePath) {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  try {
    const file = await readFile(filePath)
    const ext = path[path.length - 1].split(".").pop()

    const contentTypes: Record<string, string> = {
      glb: "model/gltf-binary",
      gltf: "model/gltf+json",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
    }

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentTypes[ext || ""] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }
}
