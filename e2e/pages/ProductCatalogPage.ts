import { type Locator, type Page } from '@playwright/test'

export class ProductCatalogPage {
	readonly page: Page
	readonly heading: Locator
	readonly productCards: Locator

	constructor(page: Page) {
		this.page = page
		this.heading = page.getByRole('heading', { name: 'Productos' })
		this.productCards = page.getByRole('article')
	}

	async goto() {
		await this.page.goto('/')
	}

	async addToCart(productName: string) {
		const card = this.getProduct(productName)
		await card.getByRole('button', { name: 'Me lo llevo' }).click()
	}

	getProduct(productName: string): Locator {
		return this.page.locator('article').filter({
			has: this.page.getByRole('heading', { name: productName }),
		})
	}

	async getProductPrice(productName: string): Promise<string> {
		const card = this.getProduct(productName)
		const priceText = await card.locator('p').filter({ hasText: 'EUR' }).textContent()

		return priceText ?? ''
	}
}
