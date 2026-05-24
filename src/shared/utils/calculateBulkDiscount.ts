import { PRICE_DECIMALS } from '@shared/constants'
import { kBUSINESS_RULES } from '@shared/constants/businessRules'
import type { CartItem } from '@shared/types/Cart'

const pricePrecision = 10 ** PRICE_DECIMALS

export function calculateBulkDiscount(cartItems: CartItem[]): number {
  const discount = cartItems.reduce((total, item) => {
    if (item.quantity < kBUSINESS_RULES.bulkDiscount.minItems) {
      return total
    }

    return total + item.product.price * item.quantity * (kBUSINESS_RULES.bulkDiscount.percentage / 100)
  }, 0)

  return Math.round(discount * pricePrecision) / pricePrecision
}
