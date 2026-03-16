import { Product } from "../types/product"

export const products: Record<string, Product> = {
  "rtx 4060": {
    name: "RTX 4060",
    prices: [
      { shop: "Amazon", price: 59800, url: "https://www.amazon.co.jp" },
      { shop: "楽天", price: 61200, url: "https://www.rakuten.co.jp" },
      { shop: "Yahoo", price: 58900, url: "https://shopping.yahoo.co.jp" }
    ],
    ai: "フルHDゲーム向けとして人気のGPU。価格と性能のバランスが良い。"
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
  "7800x3d": {
    name: "Ryzen 7 7800X3D",
    prices: [
      { shop: "Amazon", price: 54800, url: "https://www.amazon.co.jp" },
      { shop: "楽天", price: 55980, url: "https://www.rakuten.co.jp" },
      { shop: "Yahoo", price: 54500, url: "https://shopping.yahoo.co.jp" }
    ],
    ai: "ゲーミング性能が非常に高く、ハイエンドPC構成で人気のCPU。"
  }
}