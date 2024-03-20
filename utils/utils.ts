import type { ShoppingData } from '~/interface/Shopping'

export const getPersonalTotal = (data: ShoppingData) => {
  let total = 0
  data.items.forEach((item) => {
    total += item.price
  })
  return total
}
