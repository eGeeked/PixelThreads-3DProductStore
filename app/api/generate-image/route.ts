import { NextRequest, NextResponse } from "next/server"

const apiKey = process.env.WIZMODEL_API_KEY
const apiUrl = "https://api.wizmodel.com/sdapi/v1/txt2img"

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { message: "Prompt is required" },
        { status: 400 }
      )
    }

    if (!apiKey) {
      return NextResponse.json(
        { message: "AI image generation API key not configured" },
        { status: 500 }
      )
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        prompt: prompt,
        steps: 100,
      }),
    })

    const result = await response.json()

    if (result && result.images && result.images[0]) {
      return NextResponse.json({ photo: result.images[0] })
    }

    return NextResponse.json(
      { message: "Failed to generate image" },
      { status: 500 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
