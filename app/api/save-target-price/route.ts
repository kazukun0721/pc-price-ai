import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, targetPrice } = body

    if (!name || !targetPrice) {
      return NextResponse.json(
        { error: "name または targetPrice が不足しています" },
        { status: 400 }
      )
    }

    const filePath = path.join(process.cwd(), "data", "targets.json")

    let data: Record<string, number> = {}

    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath, "utf8")
      data = JSON.parse(file || "{}")
    }

    data[name] = Number(targetPrice)

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8")

    return NextResponse.json({ success: true, targetPrice: data[name] })
  } catch (error) {
    return NextResponse.json(
      { error: "保存に失敗しました" },
      { status: 500 }
    )
  }
}