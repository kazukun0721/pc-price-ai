"use client"

import { useState } from "react"
import Link from "next/link"

type PredictResult = {
  keyword: string
  currentPrice: number
  predictedLow: number
  predictedHigh: number
  recommendation: string
}

export default function PredictPage() {
  const [keyword, setKeyword] = useState("rtx 4060")
  const [result, setResult] = useState<PredictResult | null>(null)

  const runPrediction = () => {
    const base = getBasePrice(keyword)

    const predictedLow = Math.round(base * 0.94)
    const predictedHigh = Math.round(base * 1.03)

    let recommendation = "通常価格帯。急ぎでなければ少し様子見。"

    if (base <= predictedLow * 1.02) {
      recommendation = "かなり安め。今が買い時の可能性高め。"
    } else if (base >= predictedHigh * 0.98) {
      recommendation = "やや高め。値下がり待ち候補。"
    }

    setResult({
      keyword,
      currentPrice: base,
      predictedLow,
      predictedHigh,
      recommendation,
    })
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex gap-4 mb-6 flex-wrap">
          <Link href="/" className="bg-blue-600 px-4 py-2 rounded-xl font-bold">
            トップ
          </Link>
          <Link href="/ranking" className="bg-purple-600 px-4 py-2 rounded-xl font-bold">
            人気ランキング
          </Link>
          <Link href="/deals" className="bg-red-600 px-4 py-2 rounded-xl font-bold">
            値下がり
          </Link>
          <Link href="/build" className="bg-green-600 px-4 py-2 rounded-xl font-bold">
            おすすめ構成
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-3">📈 価格予測AI</h1>
        <p className="text-slate-400 mb-8">
          キーワードから簡易的に価格レンジを予測
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <div className="flex gap-3">
            <input
              className="flex-1 rounded-xl bg-slate-950 px-4 py-3 border border-slate-700"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runPrediction()
              }}
              placeholder="例: rtx 4060 / 7800x3d / rx 7800 xt"
            />
            <button
              onClick={runPrediction}
              className="bg-blue-600 px-6 py-3 rounded-xl font-bold"
            >
              予測
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-2xl font-bold">{result.keyword}</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-950 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-1">現在想定価格</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {result.currentPrice.toLocaleString()}円
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-1">予測下限</p>
                <p className="text-2xl font-bold text-blue-400">
                  {result.predictedLow.toLocaleString()}円
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-1">予測上限</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {result.predictedHigh.toLocaleString()}円
                </p>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-4">
              <p className="text-sm text-blue-400 mb-2">AIコメント</p>
              <p className="leading-7">{result.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function getBasePrice(keyword: string): number {
  const q = keyword.toLowerCase()

  if (q.includes("rtx 4060")) return 59800
  if (q.includes("rtx 4070 super")) return 95800
  if (q.includes("rtx 4070")) return 89800
  if (q.includes("rtx 4080")) return 158000
  if (q.includes("7800x3d")) return 54800
  if (q.includes("7600")) return 29800
  if (q.includes("rx 7700")) return 62800
  if (q.includes("rx 7800")) return 79800
  if (q.includes("ssd 1tb")) return 9980
  if (q.includes("ssd 2tb")) return 16980

  return 50000
}