import { act, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Toast from './Toast'

describe('Toast', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it('renders the message with role alert and aria-live', () => {
		render(<Toast message='Producto agregado al carrito' variant='success' onClose={vi.fn()} />)

		const toast = screen.getByRole('alert')

		expect(toast).toBeInTheDocument()
		expect(toast).toHaveTextContent('Producto agregado al carrito')
		expect(toast).toHaveAttribute('aria-live', 'assertive')
	})

	it('applies the correct color for each variant', () => {
		const onClose = vi.fn()
		const { rerender } = render(<Toast message='Operacion exitosa' variant='success' onClose={onClose} />)

		expect(screen.getByRole('alert')).toHaveClass('bg-emerald-100', 'text-emerald-700')

		rerender(<Toast message='Ha ocurrido un error' variant='error' onClose={onClose} />)

		expect(screen.getByRole('alert')).toHaveClass('bg-red-100', 'text-red-700')

		rerender(<Toast message='Informacion disponible' variant='info' onClose={onClose} />)

		expect(screen.getByRole('alert')).toHaveClass('bg-blue-100', 'text-blue-700')
	})

	it('calls onClose when the close button is clicked', async () => {
		const user = userEvent.setup()
		const onClose = vi.fn()

		render(<Toast message='Puedes cerrar esta notificacion' variant='info' onClose={onClose} />)

		await user.click(screen.getByRole('button', { name: /cerrar/i }))

		expect(onClose).toHaveBeenCalledTimes(1)
	})

	it('auto closes after 3 seconds', () => {
		vi.useFakeTimers()
		const onClose = vi.fn()

		render(<Toast message='Se cerrara automaticamente' variant='success' onClose={onClose} />)

		act(() => {
			vi.advanceTimersByTime(2999)
		})

		expect(onClose).not.toHaveBeenCalled()

		act(() => {
			vi.advanceTimersByTime(1)
		})

		expect(onClose).toHaveBeenCalledTimes(1)
	})
})
