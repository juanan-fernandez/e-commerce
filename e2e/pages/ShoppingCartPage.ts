import { type Locator, type Page } from '@playwright/test'

export class ShoppingCartPage {
	readonly page: Page
	readonly heading: Locator
	readonly emptyMessage: Locator
	readonly checkoutButton: Locator

	constructor(page: Page) {
		this.page = page
		this.heading = page.getByRole('heading', { name: 'Shopping Cart' })
		this.emptyMessage = page.getByText('Your cart is empty')
		this.checkoutButton = page.getByRole('button', { name: 'Confirmar pedido' })
	}

	private getCartItem(productName: string): Locator {
		return this.page.locator('article').filter({
			has: this.page.getByRole('heading', { name: productName }),
		})
	}

	async getQuantity(productName: string): Promise<string> {
		const card = this.getCartItem(productName)
		return await card.getByTestId('cart-item-quantity').textContent() ?? ''
	}

	async incrementQuantity(productName: string) {
		const card = this.getCartItem(productName)
		await card.getByRole('button', { name: `Increase quantity for ${productName}` }).click()
	}

	async decrementQuantity(productName: string) {
		const card = this.getCartItem(productName)
		await card.getByRole('button', { name: `Decrease quantity for ${productName}` }).click()
	}

	async removeItem(productName: string) {
		const card = this.getCartItem(productName)
		await card.getByRole('button', { name: `Remove ${productName} from cart` }).click()
	}
}
