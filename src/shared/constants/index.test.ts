import { describe, expect, it } from 'vitest'
import { PRICE_DECIMALS, UI_TEXT } from './index'

describe('shared constants', () => {
	it('exports the configured price decimals', () => {
		expect(PRICE_DECIMALS).toBe(2)
	})

	it('exports the UI text constants', () => {
		expect(UI_TEXT).toEqual({
			addToCart: 'Me lo llevo',
			removeFromCart: 'Remove',
			checkout: 'Confirmar pedido',
			emptyCart: 'Tu carrito está vacío'
		})
	})
})
