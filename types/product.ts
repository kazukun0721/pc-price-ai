export type Price = {
  shop: string
  price: number
  url: string
}

export type PriceHistory = {
  date: string
  price: number
}

export type Product = {
  name: string
  prices: Price[]
  ai: string
  history: PriceHistory[]
}