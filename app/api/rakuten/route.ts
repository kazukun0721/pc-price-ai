import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const appId = process.env.RAKUTEN_APP_ID
  const accessKey = process.env.RAKUTEN_ACCESS_KEY
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID

  if (!appId || !accessKey) {
    return NextResponse.json(
      { error: "楽天APIキーが設定されていません" },
      { status: 500 }
    )
  }

  const searchParams = req.nextUrl.searchParams
  const keyword = searchParams.get("keyword") || "rtx 4060"
  const lowerKeyword = keyword.toLowerCase()

  const params = new URLSearchParams({
    applicationId: appId,
    accessKey: accessKey,
    keyword: keyword,
    format: "json",
    formatVersion: "2",
    hits: "30",
    elements: "itemName,itemPrice,itemUrl,mediumImageUrls",
  })

  if (affiliateId) {
    params.set("affiliateId", affiliateId)
  }

  const url = `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601?${params.toString()}`

  const res = await fetch(url, {
    headers: {
      Origin: "https://pc-price-ai.vercel.app",
      Referer: "https://pc-price-ai.vercel.app/",
      "User-Agent": "Mozilla/5.0",
    },
    cache: "no-store",
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status })
  }

  const commonNgWords = [
    "ゲーミングpc",
    "デスクトップ",
    "ノート",
    "モニター",
    "液晶",
    "セット",
    "福袋",
    "中古",
    "整備済",
    "pcセット",
    "office付き",
  ]

  let extraNgWords: string[] = []

  if (lowerKeyword.includes("rtx") || lowerKeyword.includes("rx ")) {
    extraNgWords = [
      "ssd",
      "メモリ",
      "マウス",
      "キーボード",
      "cpu",
      "電源",
      "マザーボード",
    ]
  } else if (lowerKeyword.includes("ssd")) {
    extraNgWords = [
      "ゲーミングpc",
      "デスクトップ",
      "ノート",
      "ケース",
      "マウス",
      "キーボード",
      "モニター",
      "gpu",
      "rtx",
      "radeon",
    ]
  } else if (lowerKeyword.includes("7800x3d") || lowerKeyword.includes("7600") || lowerKeyword.includes("i5")) {
    extraNgWords = [
      "ゲーミングpc",
      "デスクトップ",
      "ノート",
      "メモリ",
      "ssd",
      "マウス",
      "キーボード",
      "モニター",
      "gpu",
      "rtx",
      "radeon",
    ]
  }

  const ngWords = [...commonNgWords, ...extraNgWords]

  const filtered = (data.Items || []).filter((item: any) => {
    const name = String(item.itemName || "").toLowerCase()

    for (const word of ngWords) {
      if (name.includes(word)) return false
    }

    return true
  })

  return NextResponse.json({ Items: filtered }, { status: 200 })
}