"use client"

import { useState } from "react"

const products: any = {
 "rtx 4071 super": {
name:"RTX 4071 Super",
prices:[
{shop:"Amazon",price:95800,url:"https://www.amazon.co.jp"},
{shop:"楽天",price:97200,url:"https://www.rakuten.co.jp"},
{shop:"Yahoo",price:94980,url:"https://shopping.yahoo.co.jp"}
],
ai:"WQHDゲームにも余裕があり、コスパの良い高性能GPU。"
},

"rtx 4080": {
name:"RTX 4080",
prices:[
{shop:"Amazon",price:158000,url:"https://www.amazon.co.jp"},
{shop:"楽天",price:161200,url:"https://www.rakuten.co.jp"},
{shop:"Yahoo",price:156800,url:"https://shopping.yahoo.co.jp"}
],
ai:"4Kゲームも狙えるハイエンドGPU。"
},

"rx 7700xt": {
name:"RX 7700 XT",
prices:[
{shop:"Amazon",price:62800,url:"https://www.amazon.co.jp"},
{shop:"楽天",price:64200,url:"https://www.rakuten.co.jp"},
{shop:"Yahoo",price:61800,url:"https://shopping.yahoo.co.jp"}
],
ai:"WQHDゲーミングに向いた高コスパGPU。"
},

 "rtx 4060": {
    name: "RTX 4060",
    prices: [
      { shop: "Amazon", price: 59800, url: "https://www.amazon.co.jp" },
      { shop: "楽天", price: 61200, url: "https://www.rakuten.co.jp" },
      { shop: "Yahoo", price: 58900, url: "https://shopping.yahoo.co.jp" }
    ],
    ai: "フルHDゲーム向けとして人気のGPU。価格と性能のバランスが良い。"
  },

  "rtx 4060 ti": {
    name: "RTX 4060 Ti",
    prices: [
      { shop: "Amazon", price: 71800, url: "https://www.amazon.co.jp" },
      { shop: "楽天", price: 73400, url: "https://www.rakuten.co.jp" },
      { shop: "Yahoo", price: 70980, url: "https://shopping.yahoo.co.jp" }
    ],
    ai: "フルHDからWQHDまで視野に入れやすい、少し余裕のあるゲーミング向けGPU。"
  },

  "rtx 4070": {
    name: "RTX 4070",
    prices: [
      { shop: "Amazon", price: 89800, url: "https://www.amazon.co.jp" },
      { shop: "楽天", price: 91500, url: "https://www.rakuten.co.jp" },
      { shop: "Yahoo", price: 88600, url: "https://shopping.yahoo.co.jp" }
    ],
    ai: "高画質ゲームや重めのタイトルも狙いやすい、性能重視のGPU。"
  },

  "rx 7600": {
    name: "RX 7600",
    prices: [
      { shop: "Amazon", price: 43800, url: "https://www.amazon.co.jp" },
      { shop: "楽天", price: 45200, url: "https://www.rakuten.co.jp" },
      { shop: "Yahoo", price: 42980, url: "https://shopping.yahoo.co.jp" }
    ],
    ai: "コスパ寄りでフルHDゲーム用に組みやすいGPU。予算を抑えたい人向け。"
  },

  "7800x3d": {
    name: "Ryzen 7 7800X3D",
    prices: [
      { shop: "Amazon", price: 54800, url: "https://www.amazon.co.jp" },
      { shop: "楽天", price: 55980, url: "https://www.rakuten.co.jp" },
      { shop: "Yahoo", price: 54500, url: "https://shopping.yahoo.co.jp" }
    ],
    ai: "ゲーミング性能が非常に高く、ハイエンドPC構成で人気のCPU。"
  },

  "7600": {
    name: "Ryzen 5 7600",
    prices: [
      { shop: "Amazon", price: 29800, url: "https://www.amazon.co.jp" },
      { shop: "楽天", price: 30480, url: "https://www.rakuten.co.jp" },
      { shop: "Yahoo", price: 29200, url: "https://shopping.yahoo.co.jp" }
    ],
    ai: "価格と性能のバランスが良く、初めての自作や中価格帯構成に向いているCPU。"
  },

  "i5 14400f": {
    name: "Core i5-14400F",
    prices: [
      { shop: "Amazon", price: 27800, url: "https://www.amazon.co.jp" },
      { shop: "楽天", price: 28600, url: "https://www.rakuten.co.jp" },
      { shop: "Yahoo", price: 27480, url: "https://shopping.yahoo.co.jp" }
    ],
    ai: "普段使いからゲームまで幅広く使いやすく、コスパ重視で選びやすいCPU。"
  },

  "ssd 1tb": {
    name: "NVMe SSD 1TB",
    prices: [
      { shop: "Amazon", price: 9980, url: "https://www.amazon.co.jp" },
      { shop: "楽天", price: 10480, url: "https://www.rakuten.co.jp" },
      { shop: "Yahoo", price: 9780, url: "https://shopping.yahoo.co.jp" }
    ],
    ai: "OSやゲーム保存に最適な容量。コスパの良い定番ストレージ。"
  },

  "ssd 2tb": {
    name: "NVMe SSD 2TB",
    prices: [
      { shop: "Amazon", price: 16980, url: "https://www.amazon.co.jp" },
      { shop: "楽天", price: 17580, url: "https://www.rakuten.co.jp" },
      { shop: "Yahoo", price: 16680, url: "https://shopping.yahoo.co.jp" }
    ],
    ai: "ゲームを多く入れたい人や、余裕を持って保存したい人向けの容量帯。"
  },

  "ddr5 32gb": {
    name: "DDR5 32GB メモリ",
    prices: [
      { shop: "Amazon", price: 14800, url: "https://www.amazon.co.jp" },
      { shop: "楽天", price: 15280, url: "https://www.rakuten.co.jp" },
      { shop: "Yahoo", price: 14580, url: "https://shopping.yahoo.co.jp" }
    ],
    ai: "ゲームも作業も快適にしやすい容量で、今どきの構成に合わせやすいメモリ。"
  }
}

export default function Home() {
  const [query, setQuery] = useState("")
  const [item, setItem] = useState<any>(null)

  const search = () => {
    const lowerQuery = query.toLowerCase().trim()

    const foundKey = Object.keys(products).find((key) =>
      key.includes(lowerQuery)
    )

    if (foundKey) {
      setItem(products[foundKey])
    } else {
      setItem(null)
    }
  }

  let cheapest = null

  if (item) {
    cheapest = item.prices.reduce((a: any, b: any) =>
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

        <div className="flex gap-3 mb-8">
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
            onClick={search}
          >
            検索
          </button>
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
                最安値: {cheapest.shop} {cheapest.price.toLocaleString()}円
              </p>
            </div>

            <div className="grid gap-4">
              {item.prices.map((p: any) => (
                <div
                  key={p.shop}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="text-xl font-semibold">{p.shop}</p>
                    <p className="text-slate-300">{p.price.toLocaleString()}円</p>
                    {cheapest.shop === p.shop && (
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

        {!item && query.trim() !== "" && (
          <div className="rounded-2xl border border-red-800 bg-red-950 p-6 text-red-200">
            該当する商品が見つからなかったよ。
          </div>
        )}
      </div>
    </main>
  )
}