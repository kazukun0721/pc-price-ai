"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

type RakutenItem = {
  itemName: string
  itemPrice: number
  itemUrl: string
  mediumImageUrls: string[]
}

type StorePrice = {
  store: string
  price: number
  url: string
}

const SUGGESTED_KEYWORDS = [
  "rtx 4060",
  "rtx 4070",
  "7800x3d",
  "rx 7800 xt",
  "ssd 1tb",
  "ssd 2tb",
]

export default function Home() {
  const [query, setQuery] = useState("rtx 4060")
  const [items, setItems] = useState<RakutenItem[]>([])
  const [loading, setLoading] = useState(false)

  const searchRakuten = async (forcedKeyword?: string) => {
    const keyword = (forcedKeyword ?? query).trim()
    if (!keyword) return

    setQuery(keyword)
    setLoading(true)

    try {
      const res = await fetch(`/api/rakuten?keyword=${encodeURIComponent(keyword)}`)
      const data = await res.json()

      const fetchedItems: RakutenItem[] = data.Items || []
      setItems(fetchedItems)

      for (const item of fetchedItems) {
        await fetch("/api/save-price", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: item.itemName,
            price: item.itemPrice,
          }),
        })
      }
    } catch (error) {
      console.error("検索エラー:", error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    searchRakuten("rtx 4060")
  }, [])

  const createStorePrices = (rakutenPrice: number, rakutenUrl: string): StorePrice[] => {
    const amazonPrice = Math.round(rakutenPrice * 0.98)
    const yahooPrice = Math.round(rakutenPrice * 1.01)

    return [
      {
        store: "Amazon",
        price: amazonPrice,
        url: `https://www.amazon.co.jp/s?k=${encodeURIComponent(query)}`
      },
      {
        store: "楽天",
        price: rakutenPrice,
        url: rakutenUrl,
      },
      {
        store: "Yahoo",
        price: yahooPrice,
        url: `https://shopping.yahoo.co.jp/search?p=${encodeURIComponent(query)}`
      },
    ].sort((a, b) => a.price - b.price)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex gap-4 mb-6 flex-wrap">
          <Link
            href="/ranking"
            className="bg-purple-600 px-4 py-2 rounded-xl font-bold hover:bg-purple-500"
          >
            人気ランキング
          </Link>

          <Link
            href="/deals"
            className="bg-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-500"
          >
            値下がり
          </Link>

          <Link
            href="/build"
            className="bg-green-600 px-4 py-2 rounded-xl font-bold hover:bg-green-500"
          >
            おすすめ構成
          </Link>

          <Link
            href="/predict"
            className="bg-cyan-600 px-4 py-2 rounded-xl font-bold hover:bg-cyan-500"
          >
            価格予測AI
          </Link>
        </div>

        <h1 className="text-5xl font-bold mb-2">PCパーツ価格AI</h1>
        <p className="text-slate-400 mb-8">最安比較・買い時判定・AI解説</p>

        <div className="flex gap-3 mb-4">
          <input
            className="flex-1 rounded-xl bg-slate-900 px-4 py-3 border border-slate-700 outline-none focus:border-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchRakuten()
            }}
            placeholder="例: rtx 4060 / 7800x3d / rx 7700 xt / ssd 2tb"
          />

          <button
            onClick={() => searchRakuten()}
            className="bg-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-500"
          >
            検索
          </button>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {SUGGESTED_KEYWORDS.map((keyword) => (
            <button
              key={keyword}
              onClick={() => searchRakuten(keyword)}
              className="bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl text-sm font-bold"
            >
              {keyword}
            </button>
          ))}
        </div>

        {loading && (
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            検索中...
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            商品が見つかりませんでした。
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <ProductCard
              key={i}
              item={item}
              query={query}
              storePrices={createStorePrices(item.itemPrice, item.itemUrl)}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

function ProductCard({
  item,
  query,
  storePrices,
}: {
  item: RakutenItem
  query: string
  storePrices: StorePrice[]
}) {
  const [showAiComment, setShowAiComment] = useState(false)
  const [aiComment, setAiComment] = useState("")
  const [loadingAi, setLoadingAi] = useState(false)

  const cheapestStore = storePrices[0]

  const averagePrice = useMemo(() => {
    const total = storePrices.reduce((sum, s) => sum + s.price, 0)
    return Math.round(total / storePrices.length)
  }, [storePrices])

  const currentPrice = cheapestStore.price

  const diffFromAverage = currentPrice - averagePrice
  const diffRate = averagePrice > 0 ? (diffFromAverage / averagePrice) * 100 : 0

  const buyLevel =
    currentPrice <= Math.round(averagePrice * 0.95)
      ? "excellent"
      : currentPrice <= Math.round(averagePrice * 0.98)
      ? "good"
      : currentPrice >= Math.round(averagePrice * 1.05)
      ? "high"
      : "normal"

  const buyLabel =
    buyLevel === "excellent"
      ? "🔥 今が買い時"
      : buyLevel === "good"
      ? "✅ やや安め"
      : buyLevel === "high"
      ? "⚠ やや高め"
      : "➖ 通常価格"

  const buyLabelStyle =
    buyLevel === "excellent"
      ? "bg-red-500 text-white"
      : buyLevel === "good"
      ? "bg-emerald-500 text-black"
      : buyLevel === "high"
      ? "bg-yellow-500 text-black"
      : "bg-slate-600 text-white"

  const handleStoreClick = async (storeName: string) => {
    try {
      await fetch("/api/click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: item.itemName,
          store: storeName,
        }),
      })
    } catch (error) {
      console.error("クリック記録エラー:", error)
    }
  }

  const handleAiCommentClick = async () => {
    if (showAiComment) {
      setShowAiComment(false)
      return
    }

    setShowAiComment(true)

    if (aiComment) return

    setLoadingAi(true)

    try {
      const res = await fetch("/api/ai-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          itemName: item.itemName,
          currentPrice,
          averagePrice,
          cheapestStore: cheapestStore.store,
          cheapestPrice: cheapestStore.price,
          reachedTarget: false,
          targetPrice: null,
          buyLevel,
          diffRate,
        }),
      })

      const data = await res.json()
      setAiComment(data.comment || "AIコメントの生成に失敗しました。")
    } catch (error) {
      console.error("AIコメント生成エラー:", error)
      setAiComment("AIコメントの生成に失敗しました。")
    } finally {
      setLoadingAi(false)
    }
  }

  const buttonStyle = (store: string) => {
    if (store === "Amazon") return "bg-amber-400 text-black hover:bg-amber-300"
    if (store === "楽天") return "bg-red-500 text-white hover:bg-red-400"
    return "bg-green-500 text-black hover:bg-green-400"
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition">
      <div className="flex gap-5">
        <img
          src={item.mediumImageUrls?.[0]}
          className="w-32 h-32 object-contain bg-white rounded-xl p-2"
          alt={item.itemName}
        />

        <div className="flex-1">
          <h2 className="font-bold text-lg mb-2">{item.itemName}</h2>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="text-emerald-400 text-2xl font-bold">
              {cheapestStore.price.toLocaleString()}円
            </div>

            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
              最安: {cheapestStore.store}
            </span>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${buyLabelStyle}`}>
              {buyLabel}
            </span>
          </div>

          <div className="grid gap-2 mb-4">
            {storePrices.map((s) => (
              <div
                key={s.store}
                className="flex justify-between text-sm bg-slate-950 border border-slate-800 rounded-xl px-3 py-2"
              >
                <span>{s.store}</span>
                <span>{s.price.toLocaleString()}円</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap mb-4">
            {storePrices.map((s) => (
              <a
                key={s.store}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleStoreClick(s.store)}
                className={`px-4 py-2 rounded-xl font-bold transition ${buttonStyle(s.store)}`}
              >
                {s.store}で見る
              </a>
            ))}
          </div>

          <button
            onClick={handleAiCommentClick}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl font-bold"
          >
            {showAiComment ? "AIコメントを閉じる" : "AIコメントを見る"}
          </button>

          {showAiComment && (
            <div className="mt-4 bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <p className="text-blue-400 font-bold mb-2">AIコメント</p>

              {loadingAi ? (
                <p className="text-slate-300">AIが分析中...</p>
              ) : (
                <div className="text-sm text-slate-200 leading-7 whitespace-pre-line">
                  {aiComment}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}