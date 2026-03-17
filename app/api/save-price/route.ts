import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(req: NextRequest) {

  const body = await req.json()

  const { name, price } = body

  const filePath = path.join(process.cwd(), "data", "prices.json")

  let data:any = {}

  if (fs.existsSync(filePath)) {
    const file = fs.readFileSync(filePath,"utf8")
    data = JSON.parse(file)
  }

  if (!data[name]) {
    data[name] = []
  }

  data[name].push({
    price,
    date: Date.now()
  })

  fs.writeFileSync(filePath, JSON.stringify(data,null,2))

  return NextResponse.json({ success:true })
}