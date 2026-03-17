"use client"

import { useEffect, useMemo, useState } from "react"

type RakutenItem = {
  itemName: string
  itemPrice: number
  itemUrl: string
  mediumImageUrls: string[]
}

type SavedHistoryPoint = {
  price: number
  date: number
}

type DisplayHistoryPoint = {
  date: string
  price: number
}

type StorePrice = {
  store: string
  price: number
  url: string
}

export default function Home() {
  const [query, setQuery] = useState("rtx 4060")
  const [items, setItems] = useState<RakutenItem[]>([])
  const [loading, setLoading] = useState(false)

  const searchRakuten = async () => {
    if (!query.trim()) return

    setLoading(true)

    try {
      const res = await fetch(`/api/rakuten?keyword=${encodeURIComponent(query)}`)
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

  const createStorePrices = (rakutenPrice: number, rakutenUrl: string): StorePrice[] => {
    const amazonPrice = Math.round(rakutenPrice * 0.98)
    const yahooPrice = Math.round(rakutenPrice * 1.01)

    return [
      {
        store: "Amazon",
        price: amazonPrice,
        url: "https://www.amazon.co.jp",
      },
      {
        store: "楽天",
        price: rakutenPrice,
        url: rakutenUrl,
      },
      {
        store: "Yahoo",
        price: yahooPrice,
        url: "https://shopping.yahoo.co.jp",
      },
    ].sort((a, b) => a.price - b.price)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-4xl font-bold mb-6">PCパーツ価格AI</h1>

        <div className="flex gap-3 mb-8">
          <input
            className="flex-1 rounded-xl bg-slate-900 px-4 py-3 border border-slate-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchRakuten()
            }}
            placeholder="例: rtx 4060 / 7800x3d / rx 7700 xt"
          />

          <button
            onClick={searchRakuten}
            className="bg-blue-600 px-6 py-3 rounded-xl font-bold"
          >
            検索
          </button>
        </div>

        {loading && <p>検索中...</p>}

        <div className="grid gap-6">
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
  const [history, setHistory] = useState<DisplayHistoryPoint[]>([])
  const [rawHistory, setRawHistory] = useState<SavedHistoryPoint[]>([])
  const [targetPrice, setTargetPrice] = useState("")
  const [savedTargetPrice, setSavedTargetPrice] = useState<number | null>(null)
  const [savingTarget, setSavingTarget] = useState(false)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `/api/get-price-history?name=${encodeURIComponent(item.itemName)}`
        )
        const data = await res.json()

        const saved: SavedHistoryPoint[] = data.history || []
        setRawHistory(saved)

        const formatted: DisplayHistoryPoint[] = saved.slice(-6).map((point) => {
          const d = new Date(point.date)
          return {
            date: `${d.getMonth() + 1}/${d.getDate()}`,
            price: point.price,
          }
        })

        setHistory(formatted)
      } catch (error) {
        console.error("履歴取得エラー:", error)
        setHistory([])
        setRawHistory([])
      }
    }

    const fetchTargetPrice = async () => {
      try {
        const res = await fetch(
          `/api/get-target-price?name=${encodeURIComponent(item.itemName)}`
        )
        const data = await res.json()

        if (data.targetPrice !== null) {
          setSavedTargetPrice(Number(data.targetPrice))
          setTargetPrice(String(data.targetPrice))
        } else {
          setSavedTargetPrice(null)
          setTargetPrice("")
        }
      } catch (error) {
        console.error("目標価格取得エラー:", error)
      }
    }

    fetchHistory()
    fetchTargetPrice()
  }, [item.itemName])

  const saveTargetPrice = async () => {
    if (!targetPrice.trim()) return

    const num = Number(targetPrice)
    if (Number.isNaN(num) || num <= 0) return

    setSavingTarget(true)

    try {
      const res = await fetch("/api/save-target-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: item.itemName,
          targetPrice: num,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setSavedTargetPrice(num)
      }
    } catch (error) {
      console.error("目標価格保存エラー:", error)
    } finally {
      setSavingTarget(false)
    }
  }

  const clearTargetPrice = () => {
    setSavedTargetPrice(null)
    setTargetPrice("")
  }

  const fallbackHistory: DisplayHistoryPoint[] = [
    { date: "3/11", price: Math.round(item.itemPrice * 1.08) },
    { date: "3/12", price: Math.round(item.itemPrice * 1.06) },
    { date: "3/13", price: Math.round(item.itemPrice * 1.04) },
    { date: "3/14", price: Math.round(item.itemPrice * 1.02) },
    { date: "3/15", price: Math.round(item.itemPrice * 1.01) },
    { date: "今日", price: item.itemPrice },
  ]

  const displayHistory =
    history.length > 0 ? history : fallbackHistory

  const analysisSource =
    rawHistory.length > 0
      ? rawHistory.map((h) => h.price)
      : fallbackHistory.map((h) => h.price)

  const maxPrice = useMemo(
    () => Math.max(...displayHistory.map((h) => h.price)),
    [displayHistory]
  )

  const minPrice = useMemo(
    () => Math.min(...displayHistory.map((h) => h.price)),
    [displayHistory]
  )

  const averagePrice = useMemo(() => {
    const total = analysisSource.reduce((sum, price) => sum + price, 0)
    return Math.round(total / analysisSource.length)
  }, [analysisSource])

  const currentPrice = item.itemPrice
  const cheapestStore = storePrices[0]

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

  const reachedTarget =
    savedTargetPrice !== null && currentPrice <= savedTargetPrice

  const aiComment =
    reachedTarget
      ? `設定した目標価格 ${savedTargetPrice.toLocaleString()}円 以下になっています。今が通知ライン到達です。`
      : buyLevel === "excellent"
      ? `現在価格は平均より ${Math.abs(diffRate).toFixed(1)}% 安く、かなり良い水準です。特に ${cheapestStore.store} が最安なので、購入候補として強いタイミングです。`
      : buyLevel === "good"
      ? `現在価格は平均より ${Math.abs(diffRate).toFixed(1)}% 安めです。急ぎなら十分検討しやすい価格帯です。`
      : buyLevel === "high"
      ? `現在価格は平均より ${Math.abs(diffRate).toFixed(1)}% 高めです。急ぎでなければ値下がり待ちも候補です。`
      : `現在価格はおおむね平均付近です。最安は ${cheapestStore.store} なので、買うならそこが有力です。`

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex gap-6 flex-col md:flex-row">
        <img
          src={item.mediumImageUrls?.[0]}
          className="w-32 h-32 object-contain bg-white rounded-xl p-2"
          alt={item.itemName}
        />

        <div className="flex-1">
          <h2 className="text-xl font-bold mb-3">{item.itemName}</h2>

          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <p className="text-2xl font-bold text-emerald-400">
              最安 {cheapestStore.price.toLocaleString()}円
            </p>

            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
              🏆 {cheapestStore.store} 最安値
            </span>

            <span className={`px-3 py-1 rounded-full text-sm font-bold ${buyLabelStyle}`}>
              {buyLabel}
            </span>

            {reachedTarget && (
              <span className="px-3 py-1 rounded-full text-sm font-bold bg-pink-500 text-white">
                🔔 目標価格到達
              </span>
            )}
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl mb-4">
            <p className="text-sm text-orange-400 mb-3">目標価格アラート</p>

            <div className="flex gap-3 flex-col md:flex-row">
              <input
                type="number"
                className="flex-1 rounded-xl bg-slate-900 px-4 py-3 border border-slate-700"
                placeholder="この価格以下になったら買う"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
              />

              <button
                onClick={saveTargetPrice}
                className="bg-orange-500 text-black px-5 py-3 rounded-xl font-bold"
                disabled={savingTarget}
              >
                {savingTarget ? "保存中..." : "保存"}
              </button>

              <button
                onClick={clearTargetPrice}
                className="bg-slate-700 px-5 py-3 rounded-xl font-bold"
              >
                解除
              </button>
            </div>

            {savedTargetPrice !== null && (
              <p className="text-sm text-slate-300 mt-3">
                設定中の目標価格: {savedTargetPrice.toLocaleString()}円
              </p>
            )}
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl mb-4">
            <p className="text-sm text-emerald-400 mb-3">ストア比較</p>

            <div className="grid gap-3">
              {storePrices.map((store, index) => (
                <div
                  key={store.store}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    {index === 0 && (
                      <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                        1位
                      </span>
                    )}
                    {index === 1 && (
                      <span className="bg-slate-600 px-2 py-1 rounded-full text-xs">
                        2位
                      </span>
                    )}
                    {index === 2 && (
                      <span className="bg-slate-600 px-2 py-1 rounded-full text-xs">
                        3位
                      </span>
                    )}
                    <span className="font-semibold">{store.store}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-emerald-400 font-bold">
                      {store.price.toLocaleString()}円
                    </span>
                    <a
                      href={store.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white text-black px-4 py-2 rounded-xl font-bold"
                    >
                      見る
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl mb-4">
            <p className="text-sm text-purple-400 mb-2">価格履歴</p>

            <div className="flex items-end gap-2 h-40">
              {displayHistory.map((point, index) => {
                const height = (point.price / maxPrice) * 140

                return (
                  <div key={`${point.date}-${index}`} className="flex-1 flex flex-col items-center">
                    <div
                      className={`w-full rounded-t ${
                        index === displayHistory.length - 1 ? "bg-blue-500" : "bg-slate-500"
                      }`}
                      style={{ height }}
                    />
                    <span className="text-xs mt-1">{point.date}</span>
                  </div>
                )
              })}
            </div>

            <p className="text-xs text-slate-400 mt-2">
              最安 {minPrice.toLocaleString()}円 / 平均 {averagePrice.toLocaleString()}円 / 最高 {maxPrice.toLocaleString()}円
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl mb-4">
            <p className="text-sm text-blue-400 mb-2">AIコメント</p>
            <p className="text-sm leading-7">{aiComment}</p>
          </div>
        </div>
      </div>
    </div>
  )
}