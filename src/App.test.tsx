import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
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
})
