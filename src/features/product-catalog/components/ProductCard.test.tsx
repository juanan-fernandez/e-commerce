import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { UI_TEXT } from '@shared/constants/ui'
import ProductCard from './ProductCard'

describe('ProductCard', () => {
	const product = {
		id: 'product-1',
		name: 'Zapatillas retro',
		description: 'Zapatillas urbanas con suela acolchada.',
		price: 49.9,
		image: '/images/zapatillas-retro.jpg'
	}

	it('renders product name, price and idle add-to-cart button', () => {
		render(<ProductCard product={product} onAddToCart={vi.fn()} />)

		expect(screen.getByText('Zapatillas retro')).toBeInTheDocument()
		expect(screen.getByText('EUR 49,90')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: UI_TEXT.addToCart })).toBeInTheDocument()
	})

	it('calls onAddToCart with the product on click', async () => {
		const user = userEvent.setup()
		const onAddToCart = vi.fn()

		render(<ProductCard product={product} onAddToCart={onAddToCart} />)

		await user.click(screen.getByRole('button', { name: UI_TEXT.addToCart }))

		expect(onAddToCart).toHaveBeenCalledTimes(1)
		expect(onAddToCart).toHaveBeenCalledWith(product)
	})

	it('shows loading state immediately after click and disables the button', async () => {
		const user = userEvent.setup()
		let resolveAddToCart: (() => void) | undefined
		const onAddToCart = vi.fn(() => new Promise<void>(resolve => {
			resolveAddToCart = resolve
		}))

		render(<ProductCard product={product} onAddToCart={onAddToCart} />)

		await user.click(screen.getByRole('button', { name: UI_TEXT.addToCart }))

		const loadingButton = await screen.findByRole('button', { name: 'Añadiendo...' })
		expect(loadingButton).toBeInTheDocument()
		expect(loadingButton).toBeDisabled()

		resolveAddToCart?.()
		await screen.findByRole('button', { name: 'Listo!' })
	})

	it('shows success state with green styles after the operation completes', async () => {
		const user = userEvent.setup()

		render(<ProductCard product={product} onAddToCart={vi.fn()} />)

		await user.click(screen.getByRole('button', { name: UI_TEXT.addToCart }))

		const successButton = await screen.findByRole('button', { name: 'Listo!' })
		expect(successButton).toBeInTheDocument()
		expect(successButton).toHaveClass('bg-emerald-100')
	})

	it('returns to idle state after success timeout', async () => {
		const user = userEvent.setup()

		render(<ProductCard product={product} onAddToCart={vi.fn()} />)

		await user.click(screen.getByRole('button', { name: UI_TEXT.addToCart }))
		await screen.findByRole('button', { name: 'Listo!' })

		await waitFor(() => {
			expect(screen.getByRole('button', { name: UI_TEXT.addToCart })).toBeInTheDocument()
		}, { timeout: 3000 })
	})

	it('remains clickable after returning to idle', async () => {
		const user = userEvent.setup()
		const onAddToCart = vi.fn()

		render(<ProductCard product={product} onAddToCart={onAddToCart} />)

		await user.click(screen.getByRole('button', { name: UI_TEXT.addToCart }))
		await screen.findByRole('button', { name: 'Listo!' })
		await waitFor(() => {
			expect(screen.getByRole('button', { name: UI_TEXT.addToCart })).toBeInTheDocument()
		}, { timeout: 3000 })

		await user.click(screen.getByRole('button', { name: UI_TEXT.addToCart }))
		expect(onAddToCart).toHaveBeenCalledTimes(2)
	})

	it('shows error state with red styles when onAddToCart fails', async () => {
		const user = userEvent.setup()
		const onAddToCart = vi.fn().mockRejectedValue(new Error('Failed'))

		render(<ProductCard product={product} onAddToCart={onAddToCart} />)

		await user.click(screen.getByRole('button', { name: UI_TEXT.addToCart }))

		const errorButton = await screen.findByRole('button', { name: 'Error' })
		expect(errorButton).toBeInTheDocument()
		expect(errorButton).toHaveClass('bg-red-100')
	})

	it('returns to idle after error timeout', async () => {
		const user = userEvent.setup()
		const onAddToCart = vi.fn().mockRejectedValue(new Error('Failed'))

		render(<ProductCard product={product} onAddToCart={onAddToCart} />)

		await user.click(screen.getByRole('button', { name: UI_TEXT.addToCart }))
		await screen.findByRole('button', { name: 'Error' })

		await waitFor(() => {
			expect(screen.getByRole('button', { name: UI_TEXT.addToCart })).toBeInTheDocument()
		}, { timeout: 5000 })
	})
})
