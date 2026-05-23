import { kBUSINESS_RULES } from '@shared/constants/businessRules'
import type { CartItem } from '@shared/types/Cart'
import type { DiscountStrategy } from './DiscountStrategy'

export class BulkDiscountStrategy implements DiscountStrategy {
	name = 'Bulk Discount'
	description = '10% off items with 5 or more units'

	isApplicable(items: CartItem[], _subtotal: number): boolean {
		return items.some(item => item.quantity >= kBUSINESS_RULES.bulkDiscount.minItems)
	}

	calculate(items: CartItem[], _subtotal: number): number {
		const qualifyingSubtotal = items.reduce((total, item) => {
			if (item.quantity < kBUSINESS_RULES.bulkDiscount.minItems) {
				return total
			}

			return total + item.product.price * item.quantity
		}, 0)

		return qualifyingSubtotal * (kBUSINESS_RULES.bulkDiscount.percentage / 100)
	}
}
