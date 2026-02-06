import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const filePath = join(process.cwd(), "public", ...path)

  try {
    const file = await readFile(filePath)
    console.log("[v0] Serving model file:", filePath, "size:", file.byteLength, "bytes")
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
  } catch (e) {
    console.log("[v0] Error serving model:", filePath, e)
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }
}
