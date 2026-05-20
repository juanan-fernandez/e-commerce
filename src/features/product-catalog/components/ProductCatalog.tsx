import { products } from '@shared/data/products'
import type { Product } from '@shared/types/Product'
import ProductCard from './ProductCard'

type ProductCatalogProps = {
	onAddToCart?: (product: Product) => void
}

function ProductCatalog({ onAddToCart = () => undefined }: ProductCatalogProps) {
	return (
		<section>
			<h1 className='text-3xl font-semibold text-slate-700'>Productos</h1>
			<div className='mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
				{products.map(product => (
					<ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
				))}
			</div>
		</section>
	)
}

export default ProductCatalog
