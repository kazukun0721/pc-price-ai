"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type DealItem = {
  name: string
  drop: number
  price: number
}

export default function DealsPage() {
  const [items, setItems] = useState<DealItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch("/api/deals")
        const data = await res.json()
        setItems(data || [])
      } catch (error) {
        console.error("値下がり取得エラー:", error)
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex gap-4 mb-6 flex-wrap">
          <Link
            href="/"
            className="bg-blue-600 px-4 py-2 rounded-xl font-bold"
          >
            トップ
          </Link>

          <Link
            href="/ranking"
            className="bg-purple-600 px-4 py-2 rounded-xl font-bold"
          >
            人気ランキング
          </Link>

          <Link
            href="/build"
            className="bg-green-600 px-4 py-2 rounded-xl font-bold"
          >
            おすすめ構成
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-3">🔥 今日の値下がりランキング</h1>
        <p className="text-slate-400 mb-8">
          保存された価格履歴から直近の値下がり幅を集計
        </p>

        {loading && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            読み込み中...
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            値下がりデータがまだありません。
          </div>
        )}

        <div className="grid gap-4">
          {items.map((item, index) => (
            <div
              key={item.name}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>

                <div>
                  <p className="text-lg font-bold">{item.name}</p>
                  <p className="text-slate-400 text-sm">
                    現在価格 {item.price.toLocaleString()}円
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-red-400">
                  -{item.drop.toLocaleString()}円
                </p>
                <p className="text-xs text-slate-400">直近下落幅</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}