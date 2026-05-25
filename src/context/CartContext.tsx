import type { ReactNode } from 'react'
import * as Sentry from '@sentry/react'
import { useEffect, useReducer, useRef } from 'react'
import { DiscountCalculator } from '@shared/strategies/DiscountCalculator'
import type { CartItem } from '@shared/types/Cart'
import type { Product } from '@shared/types/Product'
import { calculateCartSubTotal } from '@shared/utils/calculateCartSubTotal'
import { CartContext, type CartContextValue } from './CartContextValue'

type CartState = CartItem[]

type AddItemAction = {
	type: 'ADD_ITEM'
	payload: Product
}

type RemoveItemAction = {
	type: 'REMOVE_ITEM'
	payload: string
}

type UpdateQuantityAction = {
	type: 'UPDATE_QUANTITY'
	payload: {
		productId: string
		quantity: number
	}
}

type ClearCartAction = {
	type: 'CLEAR_CART'
}

type CartAction = AddItemAction | RemoveItemAction | UpdateQuantityAction | ClearCartAction

const CART_STORAGE_KEY = 'cart-items'
const discountCalculator = new DiscountCalculator()

function getItemCount(items: CartState): number {
	return items.reduce((totalItems, item) => totalItems + item.quantity, 0)
}

function addCartBreadcrumb(message: string, data: Record<string, string | number | undefined>) {
	Sentry.addBreadcrumb({
		category: 'cart',
		message,
		level: 'info',
		data,
	})
}

function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case 'ADD_ITEM': {
			const existingItem = state.find(item => item.product.id === action.payload.id)

			if (!existingItem) {
				return [...state, { product: action.payload, quantity: 1 }]
			}

			return state.map(item =>
				item.product.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
			)
		}

		case 'REMOVE_ITEM':
			return state.filter(item => item.product.id !== action.payload)

		case 'UPDATE_QUANTITY': {
			if (action.payload.quantity === 0) {
				return state.filter(item => item.product.id !== action.payload.productId)
			}

			return state.map(item =>
				item.product.id === action.payload.productId ? { ...item, quantity: action.payload.quantity } : item
			)
		}

		case 'CLEAR_CART':
			return []
	}
}

function initializeCart(): CartState {
	const storedCart = localStorage.getItem(CART_STORAGE_KEY)

	if (!storedCart) {
		return []
	}

	try {
		return JSON.parse(storedCart) as CartState
	} catch {
		return []
	}
}

type CartProviderProps = Readonly<{
	children: ReactNode
}>

export function CartProvider({ children }: CartProviderProps) {
	const [items, dispatch] = useReducer(cartReducer, [], initializeCart)
	const isInitialAmount = useRef(true)
	const subtotal = calculateCartSubTotal(items)
	const discountBreakdown = discountCalculator.getBreakdown(items)
	const discount = discountBreakdown.reduce((total, currentDiscount) => total + currentDiscount.amount, 0)
	const total = subtotal - discount

	useEffect(() => {
		if (isInitialAmount.current) {
			isInitialAmount.current = false
			return
		}

		localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
	}, [items])

	const value: CartContextValue = {
		items,
		itemCount: getItemCount(items),
		subtotal,
		discount,
		total,
		discountBreakdown,
		addItem: product => {
			const existingItem = items.find(item => item.product.id === product.id)

			addCartBreadcrumb('Cart item added', {
				productId: product.id,
				productName: product.name,
				quantity: existingItem ? existingItem.quantity + 1 : 1,
				itemCountBefore: getItemCount(items),
				itemCountAfter: getItemCount(items) + 1,
			})

			dispatch({ type: 'ADD_ITEM', payload: product })
		},
		removeItem: productId => {
			const existingItem = items.find(item => item.product.id === productId)
			const itemCountBefore = getItemCount(items)
			const removedQuantity = existingItem?.quantity ?? 0

			addCartBreadcrumb('Cart item removed', {
				productId,
				productName: existingItem?.product.name,
				quantity: removedQuantity,
				itemCountBefore,
				itemCountAfter: Math.max(0, itemCountBefore - removedQuantity),
			})

			dispatch({ type: 'REMOVE_ITEM', payload: productId })
		},
		updateQuantity: (productId, quantity) => {
			const existingItem = items.find(item => item.product.id === productId)
			const currentQuantity = existingItem?.quantity ?? 0
			const itemCountBefore = getItemCount(items)
			const itemCountAfter = itemCountBefore - currentQuantity + quantity

			addCartBreadcrumb('Cart item quantity updated', {
				productId,
				productName: existingItem?.product.name,
				quantity,
				previousQuantity: currentQuantity,
				itemCountBefore,
				itemCountAfter: Math.max(0, itemCountAfter),
			})

			dispatch({
				type: 'UPDATE_QUANTITY',
				payload: { productId, quantity },
			})
		},
		clearCart: () => {
			addCartBreadcrumb('Cart cleared', {
				itemCountBefore: getItemCount(items),
				itemCountAfter: 0,
				productsRemoved: items.length,
			})

			dispatch({ type: 'CLEAR_CART' })
		},
	}

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
