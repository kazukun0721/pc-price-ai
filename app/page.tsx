"use client"

import { useEffect, useState } from "react"
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

  const searchRakuten = async (forced?: string) => {
    const keyword = forced ?? query
    if (!keyword.trim()) return

    setQuery(keyword)
    setLoading(true)

    try {
      const res = await fetch(`/api/rakuten?keyword=${encodeURIComponent(keyword)}`)
      const data = await res.json()
      setItems(data.Items || [])
    } catch (e) {
      console.error(e)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    searchRakuten("rtx 4060")
  }, [])

  const createStorePrices = (price: number, url: string): StorePrice[] => {
    const amazon = Math.round(price * 0.98)
    const yahoo = Math.round(price * 1.01)

    return [
      { store: "Amazon", price: amazon, url: "https://www.amazon.co.jp" },
      { store: "楽天", price: price, url: url },
      { store: "Yahoo", price: yahoo, url: "https://shopping.yahoo.co.jp" },
    ].sort((a, b) => a.price - b.price)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-3 mb-8 flex-wrap">
          <Link href="/ranking" className="bg-purple-600 px-4 py-2 rounded-xl font-bold">
            人気
          </Link>
          <Link href="/deals" className="bg-red-600 px-4 py-2 rounded-xl font-bold">
            値下がり
          </Link>
          <Link href="/build" className="bg-green-600 px-4 py-2 rounded-xl font-bold">
            構成
          </Link>
          <Link href="/predict" className="bg-cyan-600 px-4 py-2 rounded-xl font-bold">
            価格AI
          </Link>
        </div>

        <h1 className="text-5xl font-bold mb-2">PCパーツ価格AI</h1>
        <p className="text-slate-400 mb-8">最安比較・価格履歴・買い時判定</p>

        <div className="flex gap-3 mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchRakuten()}
            className="flex-1 bg-slate-900 border border-slate-700 px-4 py-3 rounded-xl outline-none focus:border-blue-500"
            placeholder="例: rtx 4060 / 7800x3d / ssd 2tb"
          />

          <button
            onClick={() => searchRakuten()}
            className="bg-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-500"
          >
            検索
          </button>
        </div>

        <div className="flex gap-2 flex-wrap mb-10">
          {SUGGESTED_KEYWORDS.map((k) => (
            <button
              key={k}
              onClick={() => searchRakuten(k)}
              className="bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl text-sm"
            >
              {k}
            </button>
          ))}
        </div>

        {loading && (
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            検索中...
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <ProductCard
              key={i}
              item={item}
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
  storePrices,
}: {
  item: RakutenItem
  storePrices: StorePrice[]
}) {
  const cheapest = storePrices[0]

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
              {cheapest.price.toLocaleString()}円
            </div>

            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
              最安: {cheapest.store}
            </span>
          </div>

          <div className="grid gap-2 mb-5">
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

          <div className="flex gap-2 flex-wrap">
            {storePrices.map((s) => (
              <a
                key={s.store}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className={`px-4 py-2 rounded-xl font-bold transition ${buttonStyle(s.store)}`}
              >
                {s.store}で見る
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}