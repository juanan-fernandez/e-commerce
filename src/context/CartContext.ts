import type { ReactNode } from 'react'
import { createContext, createElement, useEffect, useReducer, useRef } from 'react'
import type { CartItem } from '@shared/types/Cart'
import type { Product } from '@shared/types/Product'
import { DiscountCalculator } from '@shared/strategies/DiscountCalculator'
import { calculateCartSubTotal } from '@shared/utils/calculateCartSubTotal'
import type { CartContextValue } from './CartContextValue'

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

export const CartContext = createContext<CartContextValue | undefined>(undefined)

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

type CartProviderProps = {
	children: ReactNode
}

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
		itemCount: items.reduce((total, item) => total + item.quantity, 0),
		subtotal,
		discount,
		total,
		discountBreakdown,
		addItem: product => {
			dispatch({ type: 'ADD_ITEM', payload: product })
		},
		removeItem: productId => {
			dispatch({ type: 'REMOVE_ITEM', payload: productId })
		},
		updateQuantity: (productId, quantity) => {
			dispatch({
				type: 'UPDATE_QUANTITY',
				payload: { productId, quantity }
			})
		},
		clearCart: () => {
			dispatch({ type: 'CLEAR_CART' })
		}
	}

	return createElement(CartContext.Provider, { value }, children)
}
