export interface ItemData {
  productName: string
  price: number
}
export interface ShoppingData {
  name: string
  displayName: string
  items: ItemData[]
}
