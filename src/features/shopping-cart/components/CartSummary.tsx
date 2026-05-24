import { kBUSINESS_RULES } from '@shared/constants/businessRules'
import { formatPrice } from '@shared/utils/formatPrice'

type CartSummaryProps = Readonly<{
	subtotal: number
	discount: number
	total: number
	itemCount: number
	discountBreakdown: Array<{
		name: string
		amount: number
	}>
}>

export function CartSummary({ subtotal, discount, total, itemCount, discountBreakdown }: CartSummaryProps) {
	const showDiscount = discount > 0
	const hasOrderDiscount = discountBreakdown.some(currentDiscount => currentDiscount.name === 'Order Discount')
	const showPromoMessage = !hasOrderDiscount && total < kBUSINESS_RULES.orderDiscount.minSubtotal
	const missingAmount = kBUSINESS_RULES.orderDiscount.minSubtotal - total
	const promoAmount = formatPrice(missingAmount)

	return (
		<aside className='rounded-2xl bg-slate-100 p-6 shadow-md'>
			<div className='border-b border-slate-200 pb-4'>
				<p className='text-sm font-medium text-slate-500'>Summary</p>
				<p className='mt-1 text-sm text-slate-400'>{itemCount} items</p>
			</div>

			<div className='space-y-3 py-4'>
				<div className='flex items-center justify-between border-b border-slate-200 pb-3'>
					<span className='text-sm text-slate-500'>Subtotal</span>
					<span data-testid='cart-summary-subtotal' className='text-sm font-medium text-slate-900'>{formatPrice(subtotal)}</span>
				</div>

				{showDiscount
					? discountBreakdown.map(currentDiscount => (
							<div
								key={currentDiscount.name}
								className='flex items-center justify-between border-b border-slate-200 pb-3'
							>
								<span className='text-sm text-slate-500'>{currentDiscount.name}</span>
								<span className='text-sm font-medium text-emerald-700'>-{formatPrice(currentDiscount.amount)}</span>
							</div>
						))
					: null}

				<div className='flex items-center justify-between'>
					<span className='text-base font-semibold text-slate-900'>Total</span>
					<span data-testid='cart-summary-total' className='text-2xl font-bold text-slate-950'>{formatPrice(total)}</span>
				</div>
			</div>

			{showPromoMessage ? (
				<p className='rounded-xl bg-amber-100 px-4 py-3 text-sm font-medium text-amber-800'>
					Add {promoAmount} more for 15% off!
				</p>
			) : null}

			<button
				type='button'
				className='mt-4 w-full cursor-pointer rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700'
			>
				Confirmar pedido
			</button>
		</aside>
	)
}
