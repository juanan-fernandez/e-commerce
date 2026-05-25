import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

const { setUserMock } = vi.hoisted(() => ({
	setUserMock: vi.fn()
}))

vi.mock('@sentry/react', () => ({
	setUser: setUserMock
}))

import LoginDemo from './LoginDemo'

const VALID_PASSWORD = 'ValidPass12!'
const DEMO_EMAIL = 'demo@example.com'
const INVALID_EMAIL = 'blocked@example.com'

describe('LoginDemo', () => {
	beforeEach(() => {
		setUserMock.mockClear()
	})
	it('renders email and password inputs', () => {
		render(<LoginDemo />)

		expect(screen.getByLabelText('Email')).toBeInTheDocument()
		expect(screen.getByLabelText('Password')).toBeInTheDocument()
	})

	it('disables the submit button when the form is invalid', () => {
		render(<LoginDemo />)

		expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled()
	})

	it('enables the submit button when the form is valid', async () => {
		const user = userEvent.setup()

		render(<LoginDemo />)

		await user.type(screen.getByLabelText('Email'), DEMO_EMAIL)
		await user.type(screen.getByLabelText('Password'), VALID_PASSWORD)

		expect(screen.getByRole('button', { name: 'Login' })).toBeEnabled()
	})

	it('shows a red border on email blur when the email is invalid', async () => {
		const user = userEvent.setup()

		render(<LoginDemo />)

		const emailInput = screen.getByLabelText('Email')

		await user.type(emailInput, 'invalid-email')
		await user.tab()

		expect(emailInput).toHaveClass('border-red-500')
	})

	it('shows a red border on password blur when the password is invalid', async () => {
		const user = userEvent.setup()

		render(<LoginDemo />)

		const passwordInput = screen.getByLabelText('Password')

		await user.type(passwordInput, 'short')
		await user.tab()

		expect(passwordInput).toHaveClass('border-red-500')
	})

	it('shows a success message with the demo email', async () => {
		const user = userEvent.setup()

		render(<LoginDemo />)

		await user.type(screen.getByLabelText('Email'), DEMO_EMAIL)
		await user.type(screen.getByLabelText('Password'), VALID_PASSWORD)
		await user.click(screen.getByRole('button', { name: 'Login' }))

		expect(screen.getByText(`Bienvenido ${DEMO_EMAIL}`)).toBeInTheDocument()
	})

	it('sets the Sentry user context after a successful login', async () => {
		const user = userEvent.setup()

		render(<LoginDemo />)

		await user.type(screen.getByLabelText('Email'), DEMO_EMAIL)
		await user.type(screen.getByLabelText('Password'), VALID_PASSWORD)
		await user.click(screen.getByRole('button', { name: 'Login' }))

		expect(setUserMock).toHaveBeenCalledTimes(1)
		expect(setUserMock).toHaveBeenCalledWith({
			email: DEMO_EMAIL,
			username: DEMO_EMAIL,
			id: DEMO_EMAIL
		})
	})

	it('shows the block message after 3 failed attempts and disables the form fields', async () => {
		const user = userEvent.setup()

		render(<LoginDemo />)

		const emailInput = screen.getByLabelText('Email')
		const passwordInput = screen.getByLabelText('Password')
		const submitButton = screen.getByRole('button', { name: 'Login' })

		await user.type(emailInput, INVALID_EMAIL)
		await user.type(passwordInput, VALID_PASSWORD)
		await user.click(submitButton)

		await user.clear(emailInput)
		await user.clear(passwordInput)

		await user.type(emailInput, INVALID_EMAIL)
		await user.type(passwordInput, VALID_PASSWORD)
		await user.click(submitButton)

		await user.clear(emailInput)
		await user.clear(passwordInput)

		await user.type(emailInput, INVALID_EMAIL)
		await user.type(passwordInput, VALID_PASSWORD)
		await user.click(submitButton)

		expect(screen.getByText('Demasiados intentos fallidos. Formulario bloqueado.')).toBeInTheDocument()
		expect(emailInput).toBeDisabled()
		expect(passwordInput).toBeDisabled()
		expect(submitButton).toBeDisabled()
	})
})
