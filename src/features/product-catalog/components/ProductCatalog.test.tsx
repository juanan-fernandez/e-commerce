import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Product } from '@shared/types/Product'
import ProductCatalog from './ProductCatalog'

const { mockedProducts } = vi.hoisted(() => ({
	mockedProducts: [
		{
			id: 'mechanical-keyboard',
			name: 'Mechanical Keyboard',
			description: 'Compact keyboard with tactile switches.',
			price: 129.99,
			image: 'https://picsum.photos/seed/mechanical-keyboard/200'
		},
		{
			id: 'usb-microphone',
			name: 'USB Microphone',
			description: 'Clear voice capture for calls and streaming.',
			price: 89.5,
			image: 'https://picsum.photos/seed/usb-microphone/200'
		}
	] as Product[]
}))

vi.mock('@shared/data/products', () => ({
	products: mockedProducts
}))

describe('ProductCatalog', () => {
	it('renders a heading and the mocked products', () => {
		render(<ProductCatalog />)

		expect(screen.getByRole('heading', { name: 'Productos' })).toBeInTheDocument()
		expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument()
		expect(screen.getByText('USB Microphone')).toBeInTheDocument()
	})
})
