import { CartItem, CartSummary } from './components'
import { useCart } from '../../context/useCart'

export function ShoppingCart() {
	const { items, itemCount, subtotal, updateQuantity, removeItem } = useCart()
	const discount = 0
	const total = subtotal
	const isEmpty = items.length === 0

	return (
		<section className='space-y-6'>
			<header className='flex items-center gap-3'>
				<h2 className='text-3xl font-bold tracking-tight text-slate-950'>Shopping Cart</h2>
				<span className='rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white'>
					{itemCount}
				</span>
			</header>

			{isEmpty ? (
				<div className='flex items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-slate-500 shadow-sm'>
					<div className='flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600'>
						<svg
							aria-hidden='true'
							viewBox='0 0 24 24'
							className='h-6 w-6'
							fill='none'
							stroke='currentColor'
							strokeWidth='1.8'
						>
							<circle cx='9' cy='20' r='1.5' />
							<circle cx='17' cy='20' r='1.5' />
							<path d='M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L21 7H7' />
						</svg>
					</div>
					<p className='text-base font-medium'>Your cart is empty</p>
				</div>
			) : (
				<div className='grid gap-6 lg:grid-cols-[1.5fr_1fr]'>
					<div className='space-y-4'>
						{items.map(item => (
							<CartItem
								key={item.product.id}
								item={item}
								onUpdateQuantity={quantity => {
									updateQuantity(item.product.id, quantity)
								}}
								onRemove={() => {
									removeItem(item.product.id)
								}}
							/>
						))}
					</div>
					<CartSummary subtotal={subtotal} discount={discount} total={total} itemCount={itemCount} />
				</div>
			)}
		</section>
	)
}

export default ShoppingCart
