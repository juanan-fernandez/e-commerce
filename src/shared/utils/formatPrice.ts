const euroFormatter = new Intl.NumberFormat('de-DE', {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
})

export function formatPrice(value: number): string {
	return `EUR ${euroFormatter.format(value)}`
}
