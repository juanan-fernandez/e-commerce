export const kBUSINESS_RULES = {
	bulkDiscount: {
		minItems: 5,
		percentage: 10
	},
	orderDiscount: {
		minSubtotal: 100,
		percentage: 15
	},
	quantity: {
		min: 1,
		max: 99
	}
} as const
