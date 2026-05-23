import type { CartItem } from '@shared/types/Cart'
import { calculateCartSubTotal } from '@shared/utils/calculateCartSubTotal'
import { BulkDiscountStrategy } from './BulkDiscountStrategy'
import type { DiscountStrategy } from './DiscountStrategy'
import { OrderDiscountStrategy } from './OrderDiscountStrategy'

type DiscountBreakdownItem = {
	name: string
	amount: number
}

export class DiscountCalculator {
	private readonly strategies: DiscountStrategy[]

	constructor(strategies: DiscountStrategy[] = [new BulkDiscountStrategy(), new OrderDiscountStrategy()]) {
		this.strategies = strategies
	}

	calculate(items: CartItem[]): number {
		return this.getBreakdown(items).reduce((total, discount) => total + discount.amount, 0)
	}

	getBreakdown(items: CartItem[]): DiscountBreakdownItem[] {
		let remainingSubtotal = calculateCartSubTotal(items)
		const appliedDiscounts: DiscountBreakdownItem[] = []

		for (const strategy of this.strategies) {
			if (!strategy.isApplicable(items, remainingSubtotal)) {
				continue
			}

			const amount = strategy.calculate(items, remainingSubtotal)

			if (amount <= 0) {
				continue
			}

			appliedDiscounts.push({
				name: strategy.name,
				amount,
			})

			remainingSubtotal -= amount
		}

		return appliedDiscounts
	}
}
