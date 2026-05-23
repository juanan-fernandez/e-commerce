import { describe, expect, it } from 'vitest'
import { kBUSINESS_RULES } from '@shared/constants/businessRules'
import { OrderDiscountStrategy } from './OrderDiscountStrategy'

describe('OrderDiscountStrategy', () => {
	const strategy = new OrderDiscountStrategy()

	it('has the correct name', () => {
		expect(strategy.name).toBe('Order Discount')
	})

	it('is not applicable if subtotal is lower than 100', () => {
		expect(strategy.isApplicable([], kBUSINESS_RULES.orderDiscount.minSubtotal - 0.01)).toBe(false)
	})

	it('is applicable if subtotal is equal to or greater than 100', () => {
		expect(strategy.isApplicable([], kBUSINESS_RULES.orderDiscount.minSubtotal)).toBe(true)
		expect(strategy.isApplicable([], 150)).toBe(true)
	})

	it('calculates 15% correctly', () => {
		expect(strategy.calculate([], 100)).toBe(15)
		expect(strategy.calculate([], 250)).toBe(37.5)
	})
})
