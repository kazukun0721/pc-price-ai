"use client"

import { useMemo, useState } from "react"
import { products } from "../data/products"
import { Product } from "../types/product"

export default function Home() {
  const [query, setQuery] = useState("")
  const [item, setItem] = useState<Product | null>(null)

  const suggestions = useMemo(() => {
    const lowerQuery = query.toLowerCase().trim()

    if (!lowerQuery) return []

    return Object.keys(products)
      .filter((key) => key.includes(lowerQuery))
      .slice(0, 6)
  }, [query])

  const search = (forcedKey?: string) => {
    const lowerQuery = (forcedKey ?? query).toLowerCase().trim()

    const foundKey = Object.keys(products).find((key) =>
      key.includes(lowerQuery)
    )

    if (foundKey) {
      setItem(products[foundKey])
      setQuery(foundKey)
    } else {
      setItem(null)
    }
  }

  let cheapest = null

  if (item) {
    cheapest = item.prices.reduce((a, b) =>
      a.price < b.price ? a : b
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-2">PC最安値AI</h1>
        <p className="text-slate-300 mb-8">
          PCパーツを検索して、価格比較・最安値・AIコメントを表示
        </p>

        <div className="relative mb-16 z-20">
          <div className="flex gap-3">
            <input
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="例: rtx 4060 / 7800x3d / ssd 1tb"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") search()
              }}
            />

            <button
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              onClick={() => search()}
            >
              検索
            </button>
          </div>

          {query.trim() !== "" && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden z-50">
              {suggestions.map((key) => (
                <button
                  key={key}
                  type="button"
                  className="block w-full px-4 py-3 text-left text-slate-200 hover:bg-slate-800 border-b border-slate-800 last:border-b-0"
                  onClick={() => search(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {Object.keys(products).map((key) => (
            <button
              key={key}
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-200 hover:bg-slate-800"
              onClick={() => {
                setQuery(key)
                setItem(products[key])
              }}
            >
              {key}
            </button>
          ))}
        </div>

        {item && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-3xl font-bold mb-2">{item.name}</h2>
              <p className="text-emerald-400 font-semibold">
                最安値: {cheapest?.shop} {cheapest?.price.toLocaleString()}円
              </p>
            </div>

            <div className="grid gap-4">
              {item.prices.map((p) => (
                <div
                  key={p.shop}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="text-xl font-semibold">{p.shop}</p>
                    <p className="text-slate-300">{p.price.toLocaleString()}円</p>
                    {cheapest?.shop === p.shop && (
                      <p className="text-emerald-400 font-semibold mt-1">最安値</p>
                    )}
                  </div>

                  <a href={p.url} target="_blank" rel="noreferrer">
                    <button className="rounded-xl bg-white px-4 py-2 font-semibold text-black hover:bg-slate-200">
                      {p.shop}で見る
                    </button>
                  </a>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-3">AIコメント</h3>
              <p className="text-slate-200 leading-7">{item.ai}</p>
            </div>
          </div>
        )}

        {!item && query.trim() !== "" && suggestions.length === 0 && (
          <div className="rounded-2xl border border-red-800 bg-red-950 p-6 text-red-200">
            該当する商品が見つからなかったよ。
          </div>
        )}
      </div>
    </main>
  )
}