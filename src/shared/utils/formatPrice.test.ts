import { describe, expect, it } from 'vitest'
import { formatPrice } from './formatPrice'

describe('formatPrice', () => {
  it('formats prices as EUR XX,XX', () => {
    expect(formatPrice(49.9)).toBe('EUR 49,90')
    expect(formatPrice(100)).toBe('EUR 100,00')
  })

  it('uses dot as thousands separator and comma as decimal separator', () => {
    expect(formatPrice(1234.56)).toBe('EUR 1.234,56')
    expect(formatPrice(9876543.21)).toBe('EUR 9.876.543,21')
  })
})
