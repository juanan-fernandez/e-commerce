import { describe, expect, it } from 'vitest'
import { kBUSINESS_RULES } from '@shared/constants/businessRules'
import type { CartItem } from '@shared/types/Cart'
import { BulkDiscountStrategy } from './BulkDiscountStrategy'

function createCartItem(overrides: Partial<CartItem> = {}): CartItem {
	return {
		product: {
			id: 'product-1',
			name: 'Wireless Mouse',
			description: 'Compact mouse for daily work.',
			price: 50,
			image: 'https://picsum.photos/seed/wireless-mouse/200'
		},
		quantity: 1,
		...overrides
	}
}

describe('BulkDiscountStrategy', () => {
	const strategy = new BulkDiscountStrategy()

	it('has the correct name', () => {
		expect(strategy.name).toBe('Bulk Discount')
	})

	it('is not applicable if no item has 5 or more units', () => {
		const items = [
			createCartItem({ quantity: kBUSINESS_RULES.bulkDiscount.minItems - 1 }),
			createCartItem({
				product: {
					id: 'product-2',
					name: 'USB-C Hub',
					description: 'Slim hub with HDMI and USB ports.',
					price: 35,
					image: 'https://picsum.photos/seed/usb-c-hub/200'
				},
				quantity: 2
			})
		]

		expect(strategy.isApplicable(items, 270)).toBe(false)
	})

	it('is applicable if any item has 5 or more units', () => {
		const items = [createCartItem({ quantity: kBUSINESS_RULES.bulkDiscount.minItems })]

		expect(strategy.isApplicable(items, 250)).toBe(true)
	})

	it('calculates 10% correctly for qualifying items', () => {
		const items = [createCartItem({ quantity: 5 })]
		const qualifyingSubtotal = 5 * 50

		expect(strategy.calculate(items, qualifyingSubtotal)).toBe(
			qualifyingSubtotal * (kBUSINESS_RULES.bulkDiscount.percentage / 100)
		)
	})

	it('only discounts the items that qualify when there are multiple items', () => {
		const items = [
			createCartItem({ quantity: 5 }),
			createCartItem({
				product: {
					id: 'product-2',
					name: 'Noise Canceling Headphones',
					description: 'Over-ear headphones with clear audio isolation.',
					price: 120,
					image: 'https://picsum.photos/seed/noise-canceling-headphones/200'
				},
				quantity: 3
			}),
			createCartItem({
				product: {
					id: 'product-3',
					name: 'Mechanical Keyboard',
					description: 'Compact keyboard with tactile switches.',
					price: 80,
					image: 'https://picsum.photos/seed/mechanical-keyboard/200'
				},
				quantity: 6
			})
		]

		const qualifyingSubtotal = 5 * 50 + 6 * 80

		expect(strategy.calculate(items, 1090)).toBe(
			qualifyingSubtotal * (kBUSINESS_RULES.bulkDiscount.percentage / 100)
		)
	})
})
