import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const name = searchParams.get("name")

  if (!name) {
    return NextResponse.json(
      { error: "name が指定されていません" },
      { status: 400 }
    )
  }

  const filePath = path.join(process.cwd(), "data", "prices.json")

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ history: [] })
  }

  const file = fs.readFileSync(filePath, "utf8")
  const data = JSON.parse(file)

  const history = data[name] || []

  return NextResponse.json({ history })
}