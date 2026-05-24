import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { CartItem as CartItemType } from '@shared/types/Cart'
import { CartItem } from './CartItem'

const WIRELESS_MOUSE = 'Wireless Mouse'

function createCartItem(overrides: Partial<CartItemType> = {}): CartItemType {
	return {
		product: {
			id: 'wireless-mouse',
			name: WIRELESS_MOUSE,
			description: 'Compact mouse for daily work.',
			price: 49.99,
			image: 'https://picsum.photos/seed/wireless-mouse/200'
		},
		quantity: 3,
		...overrides
	}
}

describe('CartItem', () => {
	it('renders the cart item with image, name, unit price, quantity and subtotal', () => {
		const item = createCartItem()

		render(<CartItem item={item} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />)

		expect(screen.getByRole('img', { name: WIRELESS_MOUSE })).toHaveAttribute(
			'src',
			'https://picsum.photos/seed/wireless-mouse/200'
		)
		expect(screen.getByText(WIRELESS_MOUSE)).toBeInTheDocument()
		expect(screen.getByText('EUR 49,99')).toBeInTheDocument()
		expect(screen.getByText('3')).toBeInTheDocument()
		expect(screen.getByText('EUR 149,97')).toBeInTheDocument()
	})

	it('calls onUpdateQuantity with the incremented quantity when clicking the increase button', async () => {
		const user = userEvent.setup()
		const onUpdateQuantity = vi.fn()
		const item = createCartItem()

		render(<CartItem item={item} onUpdateQuantity={onUpdateQuantity} onRemove={vi.fn()} />)

		await user.click(screen.getByRole('button', { name: `Increase quantity of ${WIRELESS_MOUSE} in cart` }))

		expect(onUpdateQuantity).toHaveBeenCalledTimes(1)
		expect(onUpdateQuantity).toHaveBeenCalledWith(4)
	})

	it('calls onUpdateQuantity with the decremented quantity when clicking the decrease button', async () => {
		const user = userEvent.setup()
		const onUpdateQuantity = vi.fn()
		const item = createCartItem({ quantity: 2 })

		render(<CartItem item={item} onUpdateQuantity={onUpdateQuantity} onRemove={vi.fn()} />)

		await user.click(screen.getByRole('button', { name: `Decrease quantity of ${WIRELESS_MOUSE} in cart` }))

		expect(onUpdateQuantity).toHaveBeenCalledTimes(1)
		expect(onUpdateQuantity).toHaveBeenCalledWith(1)
	})

	it('disables the decrease button when quantity is 1', () => {
		const item = createCartItem({ quantity: 1 })

		render(<CartItem item={item} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />)

		expect(screen.getByRole('button', { name: `Decrease quantity of ${WIRELESS_MOUSE} in cart` })).toBeDisabled()
	})

	it('disables the increase button when quantity is 99', () => {
		const item = createCartItem({ quantity: 99 })

		render(<CartItem item={item} onUpdateQuantity={vi.fn()} onRemove={vi.fn()} />)

		expect(screen.getByRole('button', { name: `Increase quantity of ${WIRELESS_MOUSE} in cart` })).toBeDisabled()
	})

	it('calls onRemove when clicking the remove button', async () => {
		const user = userEvent.setup()
		const onRemove = vi.fn()
		const item = createCartItem()

		render(<CartItem item={item} onUpdateQuantity={vi.fn()} onRemove={onRemove} />)

		await user.click(screen.getByRole('button', { name: `Remove ${WIRELESS_MOUSE} from your cart` }))

		expect(onRemove).toHaveBeenCalledTimes(1)
	})
})
