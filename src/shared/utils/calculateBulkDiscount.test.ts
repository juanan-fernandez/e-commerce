import { describe, expect, it } from 'vitest'
import { kBUSINESS_RULES } from '@shared/constants/businessRules'
import type { CartItem } from '@shared/types/Cart'
import { calculateBulkDiscount } from './calculateBulkDiscount'

function createCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    product: {
      id: 'product-1',
      name: 'Mechanical Keyboard',
      description: 'Compact keyboard with tactile switches.',
      price: 100,
      image: 'https://picsum.photos/seed/mechanical-keyboard/200',
    },
    quantity: 1,
    ...overrides,
  }
}

describe('calculateBulkDiscount', () => {
  it('returns 0 for an empty cart', () => {
    expect(calculateBulkDiscount([])).toBe(0)
  })

  it('applies discount when a product has exactly the minimum bulk quantity', () => {
    const cart = [createCartItem({ quantity: kBUSINESS_RULES.bulkDiscount.minItems })]

    expect(calculateBulkDiscount(cart)).toBe(50)
  })

  it('applies discount when a product has more than the minimum bulk quantity', () => {
    const cart = [createCartItem({ quantity: 8 })]

    expect(calculateBulkDiscount(cart)).toBe(80)
  })

  it('returns 0 when a product has less than the minimum bulk quantity', () => {
    const cart = [createCartItem({ quantity: 4 })]

    expect(calculateBulkDiscount(cart)).toBe(0)
  })

  it('only applies discount to products with 5 or more units in a multi-product cart', () => {
    const cart = [
      createCartItem({ quantity: 5 }),
      createCartItem({
        product: {
          id: 'product-2',
          name: 'USB-C Hub',
          description: 'Slim hub with HDMI and USB ports.',
          price: 50,
          image: 'https://picsum.photos/seed/usb-c-hub/200',
        },
        quantity: 3,
      }),
      createCartItem({
        product: {
          id: 'product-3',
          name: 'Noise Canceling Headphones',
          description: 'Over-ear headphones with clear audio isolation.',
          price: 200,
          image: 'https://picsum.photos/seed/noise-canceling-headphones/200',
        },
        quantity: 6,
      }),
    ]

    expect(calculateBulkDiscount(cart)).toBe(170)
  })
})
