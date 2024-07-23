import { formatPrice, getHannahPay, getPersonalTotal } from './utils'
import type { ShoppingData } from '~/interface/shopping'
import { expect, test, describe } from 'vitest'

describe('getPersonalTotal', () => {
  test('ペリーのみの合計', () => {
    const perryShoppingInfo: ShoppingData = {
      name: 'perry',
      displayName: 'Perry',
      items: [
        {
          price: 120,
          productName: 'リンゴ',
          userName: 'perry'
        },
        {
          price: 100,
          productName: '水',
          userName: 'perry'
        },
        {
          price: 459,
          productName: '肉',
          userName: 'perry'
        },
        {
          price: 333,
          productName: 'おにぎり',
          userName: 'perry'
        }
      ]
    }
    expect(getPersonalTotal(perryShoppingInfo)).toBe(1012)
  })
})

describe('formatPrice', () => {
  test('コンマありの場合', () => {
    const price1 = 123456
    const price2 = 123456789
    expect(formatPrice(price1)).toBe('123,456円')
    expect(formatPrice(price2)).toBe('123,456,789円')
  })
  test('コンマなしの場合', () => {
    const price1 = 123
    const price2 = 1
    expect(formatPrice(price1)).toBe('123円')
    expect(formatPrice(price2)).toBe('1円')
  })
})
describe('getHannahPay', () => {
  test('Hannahの合計のみ', () => {
    const hannahTotalPay = 541
    const ourIndividualSplit = 2264
    expect(getHannahPay(hannahTotalPay, ourIndividualSplit)).toBe(2805)
  })
})
