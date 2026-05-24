import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('global focus styles', () => {
	it('defines visible keyboard focus styles with contrast and offset', () => {
		const cssFilePath = resolve(import.meta.dirname, 'index.css')
		const cssContent = readFileSync(cssFilePath, 'utf8')

		expect(cssContent).toContain(':focus-visible')
		expect(cssContent).toContain(':focus:not(:focus-visible)')
		expect(cssContent).toContain('outline: 3px solid')
		expect(cssContent).toContain('outline-offset: 3px')
	})
})
