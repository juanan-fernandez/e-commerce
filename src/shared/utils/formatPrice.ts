import { PRICE_DECIMALS } from '@shared/constants'

const euroFormatter = new Intl.NumberFormat('de-DE', {
	minimumFractionDigits: PRICE_DECIMALS,
	maximumFractionDigits: PRICE_DECIMALS
})

export function formatPrice(value: number): string {
	return `EUR ${euroFormatter.format(value)}`
}
