import { expect, test } from '@playwright/test'
import { ProductCatalogPage } from './pages/ProductCatalogPage'
import { ShoppingCartPage } from './pages/ShoppingCartPage'

test.describe('Shopping journey', () => {
	let catalog: ProductCatalogPage
	let cart: ShoppingCartPage

	test.beforeEach(async ({ page }) => {
		catalog = new ProductCatalogPage(page)
		cart = new ShoppingCartPage(page)

		await catalog.goto()
		await page.evaluate(() => localStorage.clear())
	})

	test('the cart is empty initially', async () => {
		await expect(cart.emptyMessage).toBeVisible()
	})

	test('adding a product displays it in the cart', async () => {
		await catalog.addToCart('Wireless Keyboard')

		await expect(cart.heading).toBeVisible()
		await expect(cart.emptyMessage).not.toBeVisible()
		await expect(cart.getQuantity('Wireless Keyboard')).resolves.toBe('1')
	})

	test('adding the same product increments the quantity', async () => {
		await catalog.addToCart('Wireless Keyboard')
		await catalog.addToCart('Wireless Keyboard')

		await expect(cart.getQuantity('Wireless Keyboard')).resolves.toBe('2')
	})

	test('the +/- buttons modify the quantity correctly', async () => {
		await catalog.addToCart('Wireless Keyboard')

		await cart.incrementQuantity('Wireless Keyboard')
		await expect(cart.getQuantity('Wireless Keyboard')).resolves.toBe('2')

		await cart.incrementQuantity('Wireless Keyboard')
		await expect(cart.getQuantity('Wireless Keyboard')).resolves.toBe('3')

		await cart.decrementQuantity('Wireless Keyboard')
		await expect(cart.getQuantity('Wireless Keyboard')).resolves.toBe('2')
	})

	test('the remove button deletes the item', async () => {
		await catalog.addToCart('Wireless Keyboard')
		await expect(cart.getQuantity('Wireless Keyboard')).resolves.toBe('1')

		await cart.removeItem('Wireless Keyboard')
		await expect(cart.emptyMessage).toBeVisible()
	})

	test('the bulk discount appears when there are 5 or more units of a product', async () => {
		for (let i = 0; i < 5; i++) {
			await catalog.addToCart('Wireless Keyboard')
		}

		await expect(cart.getQuantity('Wireless Keyboard')).resolves.toBe('5')
		await expect(cart.page.getByText('Bulk Discount')).toBeVisible()
	})

	test('the cart persists after a page refresh', async ({ page }) => {
		await catalog.addToCart('Wireless Keyboard')
		await expect(cart.getQuantity('Wireless Keyboard')).resolves.toBe('1')

		await page.reload()

		catalog = new ProductCatalogPage(page)
		cart = new ShoppingCartPage(page)

		await expect(cart.getQuantity('Wireless Keyboard')).resolves.toBe('1')
	})
})
