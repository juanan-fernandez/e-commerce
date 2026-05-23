import type { CartItem } from '@shared/types/Cart'
import type { Product } from '@shared/types/Product'

export type CartContextValue = {
	items: CartItem[]
	itemCount: number
	subtotal: number
	discount: number
	total: number
	discountBreakdown: Array<{
		name: string
		amount: number
	}>
	addItem: (product: Product) => void
	removeItem: (productId: string) => void
	updateQuantity: (productId: string, quantity: number) => void
	clearCart: () => void
}
