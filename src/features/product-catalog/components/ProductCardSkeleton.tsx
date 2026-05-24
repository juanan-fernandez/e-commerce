import { Skeleton } from '@shared/components'

function ProductCardSkeleton() {
	return (
		<article className='rounded-xl border border-slate-700 bg-slate-800 p-4 text-slate-50 shadow-lg shadow-gray-600'>
			<Skeleton variant='rectangular' height='12rem' width='100%' />
			<div className='mt-4 space-y-3'>
				<Skeleton variant='text' height='1.75rem' width='70%' />
				<Skeleton variant='text' height='1rem' width='100%' />
				<Skeleton variant='text' height='1rem' width='82%' />
				<Skeleton variant='text' height='1.25rem' width='35%' />
				<Skeleton variant='rectangular' height='2.5rem' width='8.5rem' />
			</div>
		</article>
	)
}

export default ProductCardSkeleton
