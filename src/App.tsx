import LoginDemo from '@features/auth/LoginDemo'
import ProductCatalog from '@features/product-catalog/components/ProductCatalog'
import ShoppingCart from '@features/shopping-cart/ShoppingCart'
import { CartProvider } from './context/CartContext'
import { useCart } from './context/useCart'

function AppContent() {
	const { addItem, itemCount } = useCart()
	const cartItemCountLabel = `Shopping cart with ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`

	return (
		<div className='min-h-screen bg-slate-200 px-6 py-8 text-slate-950 lg:py-12'>
			<div className='mx-auto max-w-7xl'>
				<header className='mb-8 rounded-2xl bg-white px-5 py-4 shadow-sm lg:mb-10 lg:px-6'>
					<div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
						<div className='flex items-start justify-between gap-4 lg:flex-1'>
							<div>
								<p className='text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600'>Store</p>
								<h1 className='text-2xl font-bold tracking-tight text-slate-950 lg:text-3xl'>
									Simple Product Shop
								</h1>
							</div>
							<div
								role='status'
								aria-label={cartItemCountLabel}
								className='relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm'
							>
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
								<span aria-hidden='true' className='absolute -right-1 -top-1 flex min-h-6 min-w-6 items-center justify-center rounded-full bg-cyan-500 px-1.5 text-xs font-bold text-slate-950'>
									{itemCount}
								</span>
							</div>
						</div>
						<div className='lg:w-[28rem]'>
							<LoginDemo />
						</div>
					</div>
				</header>
				<main className='grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:items-start'>
					<ProductCatalog onAddToCart={addItem} />
					<div className='lg:sticky lg:top-6'>
						<ShoppingCart />
					</div>
				</main>
			</div>
		</div>
	)
}

function App() {
	return (
		<CartProvider>
			<AppContent />
		</CartProvider>
	)
}

export default App
