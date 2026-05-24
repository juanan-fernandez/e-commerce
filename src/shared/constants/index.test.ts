import { describe, expect, it } from 'vitest'
import { PRICE_DECIMALS } from './index'

describe('shared constants', () => {
	it('exports the configured price decimals', () => {
		expect(PRICE_DECIMALS).toBe(2)
	})
})
