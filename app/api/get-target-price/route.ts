import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const name = searchParams.get("name")

    if (!name) {
      return NextResponse.json(
        { error: "name が指定されていません" },
        { status: 400 }
      )
    }

    const filePath = path.join(process.cwd(), "data", "targets.json")

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ targetPrice: null })
    }

    const file = fs.readFileSync(filePath, "utf8")
    const data: Record<string, number> = JSON.parse(file || "{}")

    return NextResponse.json({
      targetPrice: data[name] ?? null,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "取得に失敗しました" },
      { status: 500 }
    )
  }
}