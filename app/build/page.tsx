"use client"

import Link from "next/link"

type Build = {
  name: string
  cpu: string
  gpu: string
  ram: string
  price: number
  comment: string
}

const builds: Build[] = [
  {
    name: "コスパ最強",
    cpu: "Ryzen 5 5600",
    gpu: "RTX 4060",
    ram: "16GB",
    price: 120000,
    comment: "フルHDゲームなら余裕。コスパ最強クラス。",
  },
  {
    name: "配信・動画編集",
    cpu: "Ryzen 7 7800X3D",
    gpu: "RTX 4070",
    ram: "32GB",
    price: 220000,
    comment: "ゲーム＋配信＋編集まで余裕。",
  },
  {
    name: "ハイエンド",
    cpu: "Ryzen 9 7950X",
    gpu: "RTX 4090",
    ram: "64GB",
    price: 500000,
    comment: "4K・AI・開発まで全部いける。",
  },
]

export default function BuildPage() {
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
            href="/deals"
            className="bg-red-600 px-4 py-2 rounded-xl font-bold"
          >
            値下がり
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-3">
          🖥 AIおすすめPC構成
        </h1>

        <p className="text-slate-400 mb-8">
          ゲーム用途に合わせたおすすめ構成
        </p>

        <div className="grid gap-6">

          {builds.map((build, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >

              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {build.name}
                </h2>

                <span className="text-emerald-400 font-bold">
                  約 {build.price.toLocaleString()} 円
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">

                <div className="bg-slate-950 p-4 rounded-xl">
                  <p className="text-slate-400 text-sm">CPU</p>
                  <p className="font-bold">{build.cpu}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl">
                  <p className="text-slate-400 text-sm">GPU</p>
                  <p className="font-bold">{build.gpu}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl">
                  <p className="text-slate-400 text-sm">RAM</p>
                  <p className="font-bold">{build.ram}</p>
                </div>

              </div>

              <p className="text-slate-300">
                {build.comment}
              </p>

            </div>
          ))}

        </div>

      </div>
    </main>
  )
}