export type Price = {
  shop: string
  price: number
  url: string
}

export type Product = {
  name: string
  prices: Price[]
  ai: string
}