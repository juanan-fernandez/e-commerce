import { describe, expect, it } from 'vitest'
import type { CartItem } from '@shared/types/Cart'
import { calculateCartSubTotal } from './calculateCartSubTotal'

function createCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    product: {
      id: 'product-1',
      name: 'Wireless Mouse',
      description: 'Compact mouse for daily work.',
      price: 49.99,
      image: 'https://picsum.photos/seed/wireless-mouse/200',
    },
    quantity: 1,
    ...overrides,
  }
}

describe('calculateCartSubTotal', () => {
  it('returns 0 for an empty cart', () => {
    expect(calculateCartSubTotal([])).toBe(0)
  })

  it('returns price multiplied by quantity for a cart with one item', () => {
    const cart = [createCartItem({ quantity: 3 })]

    expect(calculateCartSubTotal(cart)).toBe(149.97)
  })

  it('sums the subtotal of multiple cart items', () => {
    const cart = [
      createCartItem({ quantity: 2 }),
      createCartItem({
        product: {
          id: 'product-2',
          name: 'USB-C Hub',
          description: 'Hub with HDMI and USB ports.',
          price: 34.5,
          image: 'https://picsum.photos/seed/usb-c-hub/200',
        },
        quantity: 4,
      }),
    ]

    expect(calculateCartSubTotal(cart)).toBe(237.98)
  })

  it('ignores items with quantity 0', () => {
    const cart = [createCartItem({ quantity: 0 })]

    expect(calculateCartSubTotal(cart)).toBe(0)
  })

  it('returns 0 for items with price 0', () => {
    const cart = [
      createCartItem({
        product: {
          id: 'product-3',
          name: 'Gift Sticker',
          description: 'Decorative sticker included as a gift.',
          price: 0,
          image: 'https://picsum.photos/seed/gift-sticker/200',
        },
        quantity: 5,
      }),
    ]

    expect(calculateCartSubTotal(cart)).toBe(0)
  })
})
