import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
import Skeleton from './Skeleton'

describe('Skeleton', () => {
	it('renders with pulse animation', () => {
		render(<Skeleton />)

		const skeleton = screen.getByRole('status')

		expect(skeleton).toBeInTheDocument()
		expect(skeleton).toHaveClass('animate-pulse')
	})

	it('applies the correct variant classes', () => {
		const { rerender } = render(<Skeleton variant='text' />)

		expect(screen.getByRole('status')).toHaveClass('rounded')

		rerender(<Skeleton variant='rectangular' />)

		expect(screen.getByRole('status')).toHaveClass('rounded-md')

		rerender(<Skeleton variant='circular' />)

		expect(screen.getByRole('status')).toHaveClass('rounded-full')
	})

	it('accepts custom width and height', () => {
		render(<Skeleton width='120px' height='24px' />)

		expect(screen.getByRole('status')).toHaveStyle({
			width: '120px',
			height: '24px'
		})
	})

	it('uses full border radius for the circular variant', () => {
		render(<Skeleton variant='circular' />)

		expect(screen.getByRole('status')).toHaveClass('rounded-full')
	})
})
