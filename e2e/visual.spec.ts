import { expect, test } from '@playwright/test'
import { ProductCatalogPage } from './pages/ProductCatalogPage'

test.describe('Visual regression', () => {
	test('homepage with catalog', async ({ page }) => {
		const catalog = new ProductCatalogPage(page)
		await catalog.goto()
		await expect(page).toHaveScreenshot('homepage.png', { maxDiffPixelRatio: 0.05 })
	})

	test('cart with items', async ({ page }) => {
		const catalog = new ProductCatalogPage(page)
		await catalog.goto()
		await catalog.addToCart('Wireless Keyboard')
		await catalog.addToCart('USB-C Hub')
		await expect(page).toHaveScreenshot('cart-with-items.png', { maxDiffPixelRatio: 0.05 })
	})
})
