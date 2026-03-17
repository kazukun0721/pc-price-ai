import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      query,
      itemName,
      currentPrice,
      averagePrice,
      cheapestStore,
      cheapestPrice,
      reachedTarget,
      targetPrice,
      buyLevel,
      diffRate,
    } = body

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY が未設定です" },
        { status: 500 }
      )
    }

    const prompt = `
あなたはPCパーツ価格比較サイトのAIです。
以下の情報をもとに、日本語で分かりやすく、やや詳しくコメントしてください。

検索ワード: ${query}
商品名: ${itemName}
現在価格: ${currentPrice}円
平均価格: ${averagePrice}円
最安ストア: ${cheapestStore}
最安価格: ${cheapestPrice}円
目標価格到達: ${reachedTarget ? "はい" : "いいえ"}
目標価格: ${targetPrice ?? "未設定"}
買い時判定: ${buyLevel}
平均差率: ${typeof diffRate === "number" ? diffRate.toFixed(1) : "0.0"}%

条件:
- 120〜220文字くらい
- 初心者にも分かる
- 安い/高いを平均と比較して説明
- 断定しすぎない
- 目標価格到達ならその旨も触れる
`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "Gemini API error",
          status: res.status,
          details: data,
        },
        { status: 500 }
      )
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return NextResponse.json(
        {
          error: "Geminiの応答に text がありません",
          details: data,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ comment: text })
  } catch (error) {
    return NextResponse.json(
      {
        error: "AIコメント生成に失敗しました",
        details: String(error),
      },
      { status: 500 }
    )
  }
}