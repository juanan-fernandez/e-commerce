import type { CartItem } from '@shared/types/Cart'

export function calculateCartSubTotal(cartItems: CartItem[]): number {
	const subTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

	return Math.round(subTotal * 100) / 100
}
