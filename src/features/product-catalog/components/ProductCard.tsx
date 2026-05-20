import type { Product } from '@shared/types/Product'

type ProductCardProps = {
	product: Product
	onAddToCart: (product: Product) => void
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
	return (
		<article className='rounded-xl border border-slate-700 bg-slate-800 p-4 text-slate-50 shadow-lg shadow-gray-600'>
			<img className='mb-4 h-48 w-full rounded-lg object-cover' src={product.image} alt={product.name} />
			<h2 className='text-lg font-semibold'>{product.name}</h2>
			<p className='mt-1 text-sm text-slate-400'>{product.description}</p>
			<p className='mt-2 text-cyan-400'>${product.price.toFixed(2)}</p>
			<button
				type='button'
				className='mt-4 rounded-md bg-cyan-500 px-4 py-2 font-medium text-slate-950 cursor-pointer hover:bg-cyan-600'
				onClick={() => onAddToCart(product)}
			>
				Me lo llevo
			</button>
		</article>
	)
}

export default ProductCard
