import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ProductCard from './ProductCard'

describe('ProductCard', () => {
	const product = {
		id: 'product-1',
		name: 'Zapatillas retro',
		description: 'Zapatillas urbanas con suela acolchada.',
		price: 49.9,
		image: '/images/zapatillas-retro.jpg'
	}

	it('shows the product name, formatted price and add to cart button', () => {
		render(<ProductCard product={product} onAddToCart={vi.fn()} />)

		expect(screen.getByText('Zapatillas retro')).toBeInTheDocument()
		expect(screen.getByText('EUR 49,90')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Me lo llevo' })).toBeInTheDocument()
	})

	it('calls onAddToCart with the product when the button is clicked', async () => {
		const user = userEvent.setup()
		const onAddToCart = vi.fn()

		render(<ProductCard product={product} onAddToCart={onAddToCart} />)

		await user.click(screen.getByRole('button', { name: 'Me lo llevo' }))

		expect(onAddToCart).toHaveBeenCalledTimes(1)
		expect(onAddToCart).toHaveBeenCalledWith(product)
	})

	it('shows a temporary success state and remains clickable after adding a product', async () => {
		const user = userEvent.setup()
		const onAddToCart = vi.fn()

		render(<ProductCard product={product} onAddToCart={onAddToCart} />)

		await user.click(screen.getByRole('button', { name: 'Me lo llevo' }))

		const addedButton = screen.getByRole('button', { name: 'Listo!' })

		expect(addedButton).toBeInTheDocument()
		expect(addedButton).toHaveClass('text-emerald-700')
		expect(onAddToCart).toHaveBeenCalledTimes(1)

		await user.click(addedButton)

		expect(onAddToCart).toHaveBeenCalledTimes(2)

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'Me lo llevo' })).toBeInTheDocument()
		}, { timeout: 2000 })
	})
})
