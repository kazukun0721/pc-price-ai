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
  const encodedKeyword = encodeURIComponent(keyword)

  const url =
    `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601` +
    `?applicationId=${appId}` +
    `&accessKey=${accessKey}` +
    `&keyword=${encodedKeyword}` +
    `&format=json` +
    `&formatVersion=2` +
    `&hits=30` +
    `&sort=+itemPrice` +
    `&elements=itemName,itemPrice,itemUrl,mediumImageUrls` +
    (affiliateId ? `&affiliateId=${affiliateId}` : "")

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
    cache: "no-store",
  })

  const data = await res.json()

  // 除外ワード
  const NG_WORDS = [
    "ゲーミングpc",
    "デスクトップ",
    "ノート",
    "モニター",
    "液晶",
    "セット",
    "ssd",
    "メモリ",
    "マウス",
    "キーボード",
    "福袋",
    "中古",
    "整備済",
    "pcセット",
    "office付き"
  ]

  const filtered = (data.Items || []).filter((item: any) => {

    const name = item.itemName.toLowerCase()

    for (const word of NG_WORDS) {
      if (name.includes(word)) return false
    }

    return true
  })

  return NextResponse.json(
    { Items: filtered },
    { status: res.status }
  )
}