import type { CartItem } from '@shared/types/Cart'
import { kBUSINESS_RULES } from '@shared/constants/businessRules'
import type { DiscountStrategy } from './DiscountStrategy'

export class OrderDiscountStrategy implements DiscountStrategy {
	name = 'Order Discount'
	description = '15% off orders with subtotal of 100 or more'

	isApplicable(_items: CartItem[], subtotal: number): boolean {
		return subtotal >= kBUSINESS_RULES.orderDiscount.minSubtotal
	}

	calculate(_items: CartItem[], subtotal: number): number {
		return subtotal * (kBUSINESS_RULES.orderDiscount.percentage / 100)
	}
}
