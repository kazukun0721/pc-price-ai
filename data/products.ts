import { Product } from "../types/product"

export const products: Record<string, Product> = {
  "rtx 4060": {
    name: "RTX 4060",
    prices: [
      { shop: "Amazon", price: 59800, url: "https://www.amazon.co.jp" },
      { shop: "楽天", price: 61200, url: "https://www.rakuten.co.jp" },
      { shop: "Yahoo", price: 58900, url: "https://shopping.yahoo.co.jp" }
    ],
    ai: "フルHDゲーム向けとして人気のGPU。価格と性能のバランスが良い。",
    history: [
      { date: "3/10", price: 64800 },
      { date: "3/11", price: 63980 },
      { date: "3/12", price: 62800 },
      { date: "3/13", price: 61800 },
      { date: "3/14", price: 60800 },
      { date: "3/15", price: 59800 }
    ]
  },

  "rtx 4070": {
    name: "RTX 4070",
    prices: [
      { shop: "Amazon", price: 89800, url: "https://www.amazon.co.jp" },
      { shop: "楽天", price: 91500, url: "https://www.rakuten.co.jp" },
      { shop: "Yahoo", price: 88600, url: "https://shopping.yahoo.co.jp" }
    ],
    ai: "高画質ゲームや重めのタイトルも狙いやすい、性能重視のGPU。",
    history: [
      { date: "3/10", price: 94800 },
      { date: "3/11", price: 93980 },
      { date: "3/12", price: 92800 },
      { date: "3/13", price: 91800 },
      { date: "3/14", price: 90800 },
      { date: "3/15", price: 89800 }
    ]
  },

  "7800x3d": {
    name: "Ryzen 7 7800X3D",
    prices: [
      { shop: "Amazon", price: 54800, url: "https://www.amazon.co.jp" },
      { shop: "楽天", price: 55980, url: "https://www.rakuten.co.jp" },
      { shop: "Yahoo", price: 54500, url: "https://shopping.yahoo.co.jp" }
    ],
    ai: "ゲーミング性能が非常に高く、ハイエンドPC構成で人気のCPU。",
    history: [
      { date: "3/10", price: 57800 },
      { date: "3/11", price: 57200 },
      { date: "3/12", price: 56500 },
      { date: "3/13", price: 55980 },
      { date: "3/14", price: 55200 },
      { date: "3/15", price: 54800 }
    ]
  }
}