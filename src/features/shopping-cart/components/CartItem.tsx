import { kBUSINESS_RULES } from '@shared/constants/businessRules'
import type { CartItem as CartItemType } from '@shared/types/Cart'
import { formatPrice } from '@shared/utils/formatPrice'

type CartItemProps = {
	item: CartItemType
	onUpdateQuantity: (quantity: number) => void
	onRemove: () => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
	const subTotal = item.product.price * item.quantity
	const isDecreaseDisabled = item.quantity === kBUSINESS_RULES.quantity.min
	const isIncreaseDisabled = item.quantity === kBUSINESS_RULES.quantity.max

	return (
		<article className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
			<div className='flex items-start gap-4'>
				<img className='h-20 w-20 rounded-lg object-cover' src={item.product.image} alt={item.product.name} />
				<div className='min-w-0'>
					<h2 className='text-lg font-semibold text-slate-900'>{item.product.name}</h2>
					<p className='mt-1 text-sm text-slate-500'>{formatPrice(item.product.price)}</p>
				</div>
			</div>
			<div className='mt-4 flex items-center gap-3'>
				<div className='flex items-center gap-2'>
					<button
						type='button'
						aria-label={`Decrease quantity for ${item.product.name}`}
						className='cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-slate-900 disabled:cursor-not-allowed disabled:opacity-50'
						disabled={isDecreaseDisabled}
						onClick={() => onUpdateQuantity(item.quantity - 1)}
					>
						-
					</button>
					<span data-testid='cart-item-quantity' className='min-w-6 text-center text-sm font-medium text-slate-900'>{item.quantity}</span>
					<button
						type='button'
						aria-label={`Increase quantity for ${item.product.name}`}
						className='cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-slate-900 disabled:cursor-not-allowed disabled:opacity-50'
						disabled={isIncreaseDisabled}
						onClick={() => onUpdateQuantity(item.quantity + 1)}
					>
						+
					</button>
				</div>
				<p className='shrink-0 text-sm font-medium text-slate-700'>{formatPrice(subTotal)}</p>
				<button
					type='button'
					aria-label={`Remove ${item.product.name} from cart`}
					className='ml-auto cursor-pointer rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700'
					onClick={onRemove}
				>
					Remove
				</button>
			</div>
		</article>
	)
}
