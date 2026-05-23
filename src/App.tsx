import ProductCatalog from '@features/product-catalog/components/ProductCatalog'
import { CartItem, CartSummary } from '@features/shopping-cart/components'
import type { CartItem as CartItemType } from '@shared/types/Cart'

const previewCartItem: CartItemType = {
	product: {
		id: 'wireless-mouse',
		name: 'Wireless Mouse',
		description: 'Compact mouse for daily work.',
		price: 49.99,
		image: 'https://picsum.photos/seed/wireless-mouse/200'
	},
	quantity: 3
}

function App() {
	return (
		<div className='min-h-screen bg-slate-200 px-6 py-12 text-slate-950'>
			<div className='mx-auto max-w-6xl'>
				<header className='mb-10'>
					<h1 className='text-4xl font-bold tracking-tight'>Catalogo de productos</h1>
				</header>
				<main className='space-y-12'>
					<ProductCatalog
						onAddToCart={product => {
							console.log('Add to cart', product)
						}}
					/>
					<section className='grid gap-6 lg:grid-cols-[1.5fr_1fr]'>
						<CartItem
							item={previewCartItem}
							onUpdateQuantity={quantity => {
								console.log('Update quantity', quantity)
							}}
							onRemove={() => {
								console.log('Remove item', previewCartItem.product.id)
							}}
						/>
						<CartSummary subtotal={149.97} discount={0} total={149.97} itemCount={3} />
					</section>
				</main>
			</div>
		</div>
	)
}

export default App
