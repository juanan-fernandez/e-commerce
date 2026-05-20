import ProductCatalog from '@features/product-catalog/components/ProductCatalog'

function App() {
	return (
		<div className='min-h-screen bg-slate-200 px-6 py-12 text-slate-950'>
			<div className='mx-auto max-w-6xl'>
				<header className='mb-10'>
					<h1 className='text-4xl font-bold tracking-tight'>Catalogo de productos</h1>
				</header>
				<main>
					<ProductCatalog
						onAddToCart={product => {
							console.log('Add to cart', product)
						}}
					/>
				</main>
			</div>
		</div>
	)
}

export default App
