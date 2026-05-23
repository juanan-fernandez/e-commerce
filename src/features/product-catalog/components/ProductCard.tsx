import { useEffect, useRef, useState } from 'react'
import type { Product } from '@shared/types/Product'
import { formatPrice } from '@shared/utils/formatPrice'

type ProductCardProps = {
	product: Product
	onAddToCart: (product: Product) => void
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
	const [buttonState, setButtonState] = useState<'idle' | 'added'>('idle')
	const timeoutRef = useRef<number | null>(null)

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				window.clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	function handleAddToCart() {
		onAddToCart(product)
		setButtonState('added')

		if (timeoutRef.current) {
			window.clearTimeout(timeoutRef.current)
		}

		timeoutRef.current = window.setTimeout(() => {
			setButtonState('idle')
			timeoutRef.current = null
		}, 1500)
	}

	return (
		<article className='rounded-xl border border-slate-700 bg-slate-800 p-4 text-slate-50 shadow-lg shadow-gray-600'>
			<img className='mb-4 h-48 w-full rounded-lg object-cover' src={product.image} alt={product.name} />
			<h2 className='text-lg font-semibold'>{product.name}</h2>
			<p className='mt-1 text-sm text-slate-400'>{product.description}</p>
			<p className='mt-2 text-cyan-400'>{formatPrice(product.price)}</p>
			<button
				type='button'
				className={`mt-4 cursor-pointer rounded-md px-4 py-2 font-medium transition-colors ${
					buttonState === 'added'
						? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
						: 'bg-cyan-500 text-slate-950 hover:bg-cyan-600'
				}`}
				onClick={handleAddToCart}
			>
				{buttonState === 'added' ? 'Listo!' : 'Me lo llevo'}
			</button>
		</article>
	)
}

export default ProductCard
