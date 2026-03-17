import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "clicks.json")

    if (!fs.existsSync(filePath)) {
      return NextResponse.json([])
    }

    const raw = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(raw || "{}")

    const grouped: Record<string, number> = {}

    for (const key in data) {
      const [name] = key.split("_")
      grouped[name] = (grouped[name] || 0) + data[key]
    }

    const result = Object.entries(grouped)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "ランキング取得に失敗しました" },
      { status: 500 }
    )
  }
}