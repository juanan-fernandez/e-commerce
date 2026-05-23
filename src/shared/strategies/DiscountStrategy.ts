import type { CartItem } from '@shared/types/Cart'

export interface DiscountStrategy {
	name: string
	description: string
	isApplicable(items: CartItem[], subtotal: number): boolean
	calculate(items: CartItem[], subtotal: number): number
}
