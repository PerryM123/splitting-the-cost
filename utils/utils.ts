import type { ShoppingData } from '~/interface/shopping'

export const getPersonalTotal = (data: ShoppingData) => {
  let total = 0
  data.items.forEach((item) => {
    total += item.price
  })
  return total
}

export const formatPrice = (price: number) => {
  return `${price.toLocaleString('en-US')}円`
}

export const getHannahPay = (
  hannahTotalPay: number,
  ourIndividualSplit: number
) => {
  return Math.floor(hannahTotalPay + ourIndividualSplit)
}
