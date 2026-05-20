import { kBUSINESS_RULES } from '@shared/constants/businessRules'
import type { CartItem } from '@shared/types/Cart'

export function calculateBulkDiscount(cartItems: CartItem[]): number {
  const discount = cartItems.reduce((total, item) => {
    if (item.quantity < kBUSINESS_RULES.bulkDiscount.minItems) {
      return total
    }

    return total + item.product.price * item.quantity * (kBUSINESS_RULES.bulkDiscount.percentage / 100)
  }, 0)

  return Math.round(discount * 100) / 100
}
