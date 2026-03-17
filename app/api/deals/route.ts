import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "prices.json")

    if (!fs.existsSync(filePath)) {
      return NextResponse.json([])
    }

    const raw = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(raw || "{}")

    const deals: { name: string; drop: number; price: number }[] = []

    for (const name in data) {
      const history = data[name]

      if (!Array.isArray(history) || history.length < 2) continue

      const latest = history[history.length - 1]
      const prev = history[history.length - 2]

      const drop = prev.price - latest.price

      if (drop > 0) {
        deals.push({
          name,
          drop,
          price: latest.price,
        })
      }
    }

    deals.sort((a, b) => b.drop - a.drop)

    return NextResponse.json(deals.slice(0, 20))
  } catch (error) {
    return NextResponse.json(
      { error: "値下がり取得に失敗しました" },
      { status: 500 }
    )
  }
}