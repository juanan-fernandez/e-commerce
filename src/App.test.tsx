import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { UI_TEXT } from '@shared/constants/ui'
import App from './App'

describe('App', () => {
	beforeEach(() => {
		localStorage.clear()
	})

	it('renders LoginDemo in the header without interrupting catalog and cart sections', () => {
		render(<App />)

		const appHeader = screen.getByRole('heading', { name: 'Simple Product Shop' }).closest('header')

		expect(appHeader).not.toBeNull()
		expect(within(appHeader as HTMLElement).getByRole('heading', { name: 'Login Demo' })).toBeInTheDocument()
		expect(screen.getByRole('heading', { name: 'Productos' })).toBeInTheDocument()
		expect(screen.getByRole('heading', { name: 'Shopping Cart' })).toBeInTheDocument()
	})

	it('describes the cart badge item count for screen readers', () => {
		render(<App />)

		expect(screen.getByLabelText('Shopping cart with 0 items')).toBeInTheDocument()
	})

	it('shows a success toast when a product is added to the cart', async () => {
		const user = userEvent.setup()

		render(<App />)

		const productCard = screen.getByRole('heading', { name: 'Wireless Keyboard' }).closest('article')

		expect(productCard).not.toBeNull()

		await user.click(within(productCard as HTMLElement).getByRole('button', { name: UI_TEXT.addToCart }))

		expect(await screen.findByRole('alert')).toHaveTextContent('Añadido correctamente')
	})

	it('shows an info toast when a product is removed from the cart', async () => {
		const user = userEvent.setup()

		render(<App />)

		const productCard = screen.getByRole('heading', { name: 'Wireless Keyboard' }).closest('article')

		expect(productCard).not.toBeNull()

		await user.click(within(productCard as HTMLElement).getByRole('button', { name: UI_TEXT.addToCart }))
		await screen.findByRole('button', { name: 'Remove Wireless Keyboard from your cart' })

		await user.click(screen.getByRole('button', { name: 'Remove Wireless Keyboard from your cart' }))

		await waitFor(() => {
			expect(screen.getByRole('alert')).toHaveTextContent('Producto eliminado del carrito')
		})
	})
})
