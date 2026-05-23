import { describe, expect, it } from 'vitest'
import type { CartItem } from '@shared/types/Cart'
import { DiscountCalculator } from './DiscountCalculator'

function createCartItem(overrides: Partial<CartItem> = {}): CartItem {
	return {
		product: {
			id: 'product-1',
			name: 'Wireless Mouse',
			description: 'Compact mouse for daily work.',
			price: 25,
			image: 'https://picsum.photos/seed/wireless-mouse/200'
		},
		quantity: 1,
		...overrides
	}
}

describe('DiscountCalculator', () => {
	const calculator = new DiscountCalculator()

	it('returns 0 for an empty cart', () => {
		expect(calculator.calculate([])).toBe(0)
	})

	it('applies only bulk discount when it applies and subtotal is lower than 100', () => {
		const items = [
			createCartItem({
				product: {
					id: 'product-1',
					name: 'USB-C Hub',
					description: 'Slim hub with HDMI and USB ports.',
					price: 10,
					image: 'https://picsum.photos/seed/usb-c-hub/200'
				},
				quantity: 5
			})
		]

		expect(calculator.calculate(items)).toBe(5)
	})

	it('applies only order discount when subtotal is 100 or more and no item qualifies for bulk', () => {
		const items = [
			createCartItem({
				product: {
					id: 'product-1',
					name: 'Noise Canceling Headphones',
					description: 'Over-ear headphones with clear audio isolation.',
					price: 55,
					image: 'https://picsum.photos/seed/noise-canceling-headphones/200'
				},
				quantity: 2
			})
		]

		expect(calculator.calculate(items)).toBe(16.5)
	})

	it('applies bulk and order discounts sequentially when both apply', () => {
		const items = [createCartItem({ quantity: 5 })]

		expect(calculator.calculate(items)).toBe(29.375)
	})

	it('returns a breakdown with the name and amount of each applied discount', () => {
		const items = [createCartItem({ quantity: 5 })]

		expect(calculator.getBreakdown(items)).toEqual([
			{ name: 'Bulk Discount', amount: 12.5 },
			{ name: 'Order Discount', amount: 16.875 }
		])
	})
})
