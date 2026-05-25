import { useEffect, useRef, useState } from 'react'
import type { Product } from '@shared/types/Product'
import { UI_TEXT } from '@shared/constants/ui'
import { formatPrice } from '@shared/utils/formatPrice'

type ButtonState = 'idle' | 'loading' | 'success' | 'error'

const MINIMUM_LOADING_MS = 250
const SUCCESS_STATE_MS = 1500
const ERROR_STATE_MS = 2750

type ProductCardProps = Readonly<{
	product: Product
	onAddToCart: (product: Product) => void | Promise<void>
}>

function ProductCard({ product, onAddToCart }: ProductCardProps) {
	const [buttonState, setButtonState] = useState<ButtonState>('idle')
	const timeoutRef = useRef<number | null>(null)
	const interactionRef = useRef(0)

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				window.clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	function scheduleIdleReset(delayInMs: number) {
		timeoutRef.current = window.setTimeout(() => {
			setButtonState('idle')
			timeoutRef.current = null
		}, delayInMs)
	}

	async function handleAddToCart() {
		const interactionId = interactionRef.current + 1
		interactionRef.current = interactionId
		const loadingStartedAt = Date.now()

		if (timeoutRef.current) {
			window.clearTimeout(timeoutRef.current)
			timeoutRef.current = null
		}

		setButtonState('loading')

		try {
			await onAddToCart(product)
			const remainingLoadingTime = MINIMUM_LOADING_MS - (Date.now() - loadingStartedAt)

			if (remainingLoadingTime > 0) {
				await new Promise(resolve => window.setTimeout(resolve, remainingLoadingTime))
			}

			if (interactionRef.current !== interactionId) {
				return
			}

			setButtonState('success')
			scheduleIdleReset(SUCCESS_STATE_MS)
		} catch {
			const remainingLoadingTime = MINIMUM_LOADING_MS - (Date.now() - loadingStartedAt)

			if (remainingLoadingTime > 0) {
				await new Promise(resolve => window.setTimeout(resolve, remainingLoadingTime))
			}

			if (interactionRef.current !== interactionId) {
				return
			}

			setButtonState('error')
			scheduleIdleReset(ERROR_STATE_MS)
		}
	}

	function getButtonStyles(): string {
		const base = 'mt-4 cursor-pointer rounded-md px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60'

		const styles: Record<ButtonState, string> = {
			idle: 'bg-cyan-500 text-slate-950 hover:bg-cyan-600',
			loading: 'bg-slate-400 text-slate-700',
			success: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
			error: 'bg-red-100 text-red-700 hover:bg-red-200'
		}

		return `${base} ${styles[buttonState]}`
	}

	const buttonLabel: Record<ButtonState, string> = {
		idle: UI_TEXT.addToCart,
		loading: 'Añadiendo...',
		success: 'Listo!',
		error: 'Error'
	}

	const isLoading = buttonState === 'loading'
	const isSuccess = buttonState === 'success'
	const isError = buttonState === 'error'

	return (
		<article className='rounded-xl border border-slate-700 bg-slate-800 p-4 text-slate-50 shadow-lg shadow-gray-600'>
			<img className='mb-4 h-48 w-full rounded-lg object-cover' src={product.image} alt={product.name} />
			<h2 className='text-lg font-semibold'>{product.name}</h2>
			<p className='mt-1 text-sm text-slate-400'>{product.description}</p>
			<p className='mt-2 text-cyan-400'>{formatPrice(product.price)}</p>
			<button
				type='button'
				className={getButtonStyles()}
				disabled={isLoading}
				onClick={handleAddToCart}
			>
				{isLoading && (
					<span className='inline-flex items-center gap-2'>
						<svg className='h-4 w-4 animate-spin' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
							<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
							<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
						</svg>
						{buttonLabel[buttonState]}
					</span>
				)}
				{isSuccess && (
					<span className='inline-flex items-center gap-2'>
						<svg className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
							<path fillRule='evenodd' d='M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.312a1 1 0 0 1-1.42.005l-3.75-3.75a1 1 0 0 1 1.414-1.414l3.04 3.04 6.54-6.597a1 1 0 0 1 1.42-.01Z' clipRule='evenodd' />
						</svg>
						{buttonLabel[buttonState]}
					</span>
				)}
				{isError && (
					<span className='inline-flex items-center gap-2'>
						<svg className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
							<path fillRule='evenodd' d='M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.707-10.707a1 1 0 0 0-1.414-1.414L10 8.172 7.707 5.879a1 1 0 1 0-1.414 1.414L8.586 9.586l-2.293 2.293a1 1 0 1 0 1.414 1.414L10 11l2.293 2.293a1 1 0 0 0 1.414-1.414l-2.293-2.293 2.293-2.293Z' clipRule='evenodd' />
						</svg>
						{buttonLabel[buttonState]}
					</span>
				)}
				{buttonState === 'idle' && buttonLabel[buttonState]}
			</button>
		</article>
	)
}

export default ProductCard
