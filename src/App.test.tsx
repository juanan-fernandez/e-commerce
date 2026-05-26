import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UI_TEXT } from '@shared/constants/ui'

const { captureSentryTestErrorMock, isDevelopmentEnvironmentMock } = vi.hoisted(() => ({
	captureSentryTestErrorMock: vi.fn(),
	isDevelopmentEnvironmentMock: vi.fn(),
}))

vi.mock('@infrastructure/sentry', () => ({
	captureSentryTestError: captureSentryTestErrorMock,
	isDevelopmentEnvironment: isDevelopmentEnvironmentMock,
}))

import App from './App'

const SENTRY_BUTTON_LABEL = 'Probar Sentry'

describe('App', () => {
	beforeEach(() => {
		localStorage.clear()
		captureSentryTestErrorMock.mockClear()
		isDevelopmentEnvironmentMock.mockReset()
		isDevelopmentEnvironmentMock.mockReturnValue(false)
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

	it('shows a Sentry test button in the header only in development', () => {
		isDevelopmentEnvironmentMock.mockReturnValue(true)

		render(<App />)

		const appHeader = screen.getByRole('heading', { name: 'Simple Product Shop' }).closest('header')

		expect(appHeader).not.toBeNull()
		expect(within(appHeader as HTMLElement).getByRole('button', { name: SENTRY_BUTTON_LABEL })).toBeInTheDocument()
	})

	it('hides the Sentry test button outside development', () => {
		render(<App />)

		expect(screen.queryByRole('button', { name: SENTRY_BUTTON_LABEL })).not.toBeInTheDocument()
	})

	it('captures a Sentry test exception when the development button is clicked', async () => {
		const user = userEvent.setup()
		isDevelopmentEnvironmentMock.mockReturnValue(true)

		render(<App />)

		await user.click(screen.getByRole('button', { name: SENTRY_BUTTON_LABEL }))

		expect(captureSentryTestErrorMock).toHaveBeenCalledTimes(1)
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
