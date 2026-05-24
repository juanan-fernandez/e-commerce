import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import PasswordInput from './PasswordInput'

describe('PasswordInput', () => {
	it('renders the password input', () => {
		render(<PasswordInput value='' onChange={vi.fn()} showRequirements={false} />)

		const input = screen.getByLabelText('Password')
		const toggleButton = screen.getByRole('button')

		expect(input).toBeInTheDocument()
		expect(input).toHaveAttribute('type', 'password')
		expect(toggleButton).toBeInTheDocument()
		expect(toggleButton).not.toHaveAccessibleName(/password/i)
	})

	it('calls onChange when the user types', async () => {
		const user = userEvent.setup()
		const onChange = vi.fn()

		render(<PasswordInput value='' onChange={onChange} showRequirements={false} />)

		await user.type(screen.getByLabelText('Password'), 'SecurePass12!')

		expect(onChange).toHaveBeenCalled()
		expect(onChange).toHaveBeenLastCalledWith('SecurePass12!')
	})

	it('shows requirements when showRequirements is true', () => {
		render(<PasswordInput value='short' onChange={vi.fn()} showRequirements />)

		expect(screen.getByRole('list')).toBeInTheDocument()
		expect(screen.getByText(/12 characters/i)).toBeInTheDocument()
		expect(screen.getByText(/uppercase/i)).toBeInTheDocument()
		expect(screen.getByText(/lowercase/i)).toBeInTheDocument()
		expect(screen.getByText(/number/i)).toBeInTheDocument()
		expect(screen.getByText(/special character/i)).toBeInTheDocument()
	})

	it('shows the strength indicator', () => {
		render(<PasswordInput value='ValidPass12!' onChange={vi.fn()} showRequirements={false} />)

		expect(screen.getByText(/medium/i)).toBeInTheDocument()
	})
})
