import { PRICE_DECIMALS } from '@shared/constants'
import type { CartItem } from '@shared/types/Cart'

const pricePrecision = 10 ** PRICE_DECIMALS

export function calculateCartSubTotal(cartItems: CartItem[]): number {
	const subTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

	return Math.round(subTotal * pricePrecision) / pricePrecision
}
