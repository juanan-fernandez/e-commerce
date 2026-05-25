import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import type { Product } from '@shared/types/Product'
import { describe, expect, it } from 'vitest'
import { CartProvider } from '../../context/CartContext'
import { useCart } from '../../context/useCart'
import ShoppingCart from './ShoppingCart'

const testProduct: Product = {
	id: 'product-1',
	name: 'Auriculares Bluetooth',
	description: 'Auriculares con cancelacion de ruido.',
	price: 49.99,
	image: '/images/auriculares-bluetooth.jpg'
}

function CartActions() {
	const { addItem } = useCart()

	return (
		<button type='button' onClick={() => {
			addItem(testProduct)
		}}>
			Agregar producto de prueba
		</button>
	)
}

describe('ShoppingCart', () => {
	it('announces cart item and total updates with a polite live region', async () => {
		const user = userEvent.setup()

		render(
			<CartProvider>
				<ShoppingCart />
				<CartActions />
			</CartProvider>
		)

		expect(screen.getByText('Carrito actualizado: 0 articulos. Total EUR 0,00.')).toHaveAttribute('aria-live', 'polite')
		expect(screen.getByText('Carrito actualizado: 0 articulos. Total EUR 0,00.')).toHaveClass('sr-only')

		await user.click(screen.getByRole('button', { name: 'Agregar producto de prueba' }))

		expect(screen.getByText('Carrito actualizado: 1 articulo. Total EUR 49,99.')).toBeInTheDocument()

		await user.click(screen.getByRole('button', { name: 'Agregar producto de prueba' }))

		expect(screen.getByText('Carrito actualizado: 2 articulos. Total EUR 99,98.')).toBeInTheDocument()
	})
})
