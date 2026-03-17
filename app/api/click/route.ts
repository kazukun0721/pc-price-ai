import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, store } = body

  const filePath = path.join(process.cwd(), "data", "clicks.json")

  let data: Record<string, number> = {}

  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, "utf8") || "{}")
  }

  const key = `${name}_${store}`

  data[key] = (data[key] || 0) + 1

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

  return NextResponse.json({ success: true })
}