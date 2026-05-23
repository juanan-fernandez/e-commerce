import type { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { CartItem as CartItemType } from '@shared/types/Cart'
import type { Product } from '@shared/types/Product'
import { CartProvider } from './CartContext'
import { useCart } from './useCart'

const firstProduct: Product = {
	id: 'wireless-mouse',
	name: 'Wireless Mouse',
	description: 'Compact mouse for daily work.',
	price: 49.99,
	image: 'https://picsum.photos/seed/wireless-mouse/200'
}

const secondProduct: Product = {
	id: 'usb-c-hub',
	name: 'USB-C Hub',
	description: 'Slim hub with HDMI and USB ports.',
	price: 34.5,
	image: 'https://picsum.photos/seed/usb-c-hub/200'
}

function wrapper({ children }: { children: ReactNode }) {
	return <CartProvider>{children}</CartProvider>
}

function renderCartHook() {
	return renderHook(() => useCart(), { wrapper })
}

describe('CartContext', () => {
	beforeEach(() => {
		localStorage.clear()
		vi.restoreAllMocks()
	})

	it('starts with an empty cart', () => {
		const { result } = renderCartHook()

		expect(result.current.items).toEqual([])
		expect(result.current.itemCount).toBe(0)
		expect(result.current.subtotal).toBe(0)
	})

	it('loads the cart from localStorage on startup', () => {
		const storedItems: CartItemType[] = [{ product: firstProduct, quantity: 2 }]

		vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(JSON.stringify(storedItems))

		const { result } = renderCartHook()

		expect(result.current.items).toEqual(storedItems)
		expect(result.current.itemCount).toBe(2)
		expect(result.current.subtotal).toBe(99.98)
	})

	it('addItem adds a new product with quantity 1', () => {
		const { result } = renderCartHook()

		act(() => {
			result.current.addItem(firstProduct)
		})

		expect(result.current.items).toEqual([{ product: firstProduct, quantity: 1 }])
	})

	it('addItem increments quantity if the product already exists', () => {
		const { result } = renderCartHook()

		act(() => {
			result.current.addItem(firstProduct)
			result.current.addItem(firstProduct)
		})

		expect(result.current.items).toEqual([{ product: firstProduct, quantity: 2 }])
	})

	it('updateQuantity changes the quantity of an item', () => {
		const { result } = renderCartHook()

		act(() => {
			result.current.addItem(firstProduct)
			result.current.updateQuantity(firstProduct.id, 4)
		})

		expect(result.current.items).toEqual([{ product: firstProduct, quantity: 4 }])
	})

	it('updateQuantity removes the item when quantity is 0', () => {
		const { result } = renderCartHook()

		act(() => {
			result.current.addItem(firstProduct)
			result.current.updateQuantity(firstProduct.id, 0)
		})

		expect(result.current.items).toEqual([])
	})

	it('removeItem removes an item from the cart', () => {
		const { result } = renderCartHook()

		act(() => {
			result.current.addItem(firstProduct)
			result.current.addItem(secondProduct)
			result.current.removeItem(firstProduct.id)
		})

		expect(result.current.items).toEqual([{ product: secondProduct, quantity: 1 }])
	})

	it('clearCart empties the entire cart', () => {
		const { result } = renderCartHook()

		act(() => {
			result.current.addItem(firstProduct)
			result.current.addItem(secondProduct)
			result.current.clearCart()
		})

		expect(result.current.items).toEqual([])
		expect(result.current.itemCount).toBe(0)
		expect(result.current.subtotal).toBe(0)
	})

	it('itemCount sums all item quantities', () => {
		const { result } = renderCartHook()

		act(() => {
			result.current.addItem(firstProduct)
			result.current.addItem(firstProduct)
			result.current.addItem(secondProduct)
		})

		expect(result.current.itemCount).toBe(3)
	})

	it('subtotal calculates price multiplied by quantity for all items', () => {
		const { result } = renderCartHook()

		act(() => {
			result.current.addItem(firstProduct)
			result.current.addItem(firstProduct)
			result.current.addItem(secondProduct)
			result.current.updateQuantity(secondProduct.id, 3)
		})

		expect(result.current.subtotal).toBe(203.48)
	})
})
