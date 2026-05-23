import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CartSummary } from './CartSummary'

describe('CartSummary', () => {
	it('renders the formatted subtotal', () => {
		render(<CartSummary subtotal={49.99} discount={0} total={49.99} itemCount={1} />)

		const subtotalRow = screen.getByText('Subtotal').parentElement

		expect(subtotalRow).not.toBeNull()
		expect(within(subtotalRow as HTMLElement).getByText('EUR 49,99')).toBeInTheDocument()
	})

	it('renders the discount with a negative sign when discount is greater than 0', () => {
		render(<CartSummary subtotal={120} discount={18} total={102} itemCount={3} />)

		expect(screen.getByText('-EUR 18,00')).toBeInTheDocument()
	})

	it('does not render the discount line when discount is 0', () => {
		render(<CartSummary subtotal={80} discount={0} total={80} itemCount={2} />)

		expect(screen.queryByText(/-EUR/)).not.toBeInTheDocument()
	})

	it('renders the formatted total', () => {
		render(<CartSummary subtotal={120} discount={18} total={102} itemCount={3} />)

		expect(screen.getByText('EUR 102,00')).toBeInTheDocument()
	})

	it('shows the promo message when subtotal is lower than 100', () => {
		render(<CartSummary subtotal={80} discount={0} total={80} itemCount={2} />)

		expect(screen.getByText('Add $20.00 more for 15% off!')).toBeInTheDocument()
	})

	it('does not show the promo message when subtotal is 100 or more', () => {
		render(<CartSummary subtotal={100} discount={15} total={85} itemCount={2} />)

		expect(screen.queryByText(/Add \$.* more for 15% off!/)).not.toBeInTheDocument()
	})

	it('renders the checkout button', () => {
		render(<CartSummary subtotal={120} discount={18} total={102} itemCount={3} />)

		expect(screen.getByRole('button', { name: 'Confirmar pedido' })).toBeInTheDocument()
	})
})
