import type { CSSProperties } from 'react'

type SkeletonVariant = 'text' | 'rectangular' | 'circular'

type SkeletonProps = Readonly<{
	variant?: SkeletonVariant
	width?: CSSProperties['width']
	height?: CSSProperties['height']
}>

const variantClassNames = {
	text: 'rounded',
	rectangular: 'rounded-md',
	circular: 'rounded-full'
} as const

function Skeleton({ variant = 'text', width, height }: SkeletonProps) {
	return (
		<div
			role='status'
			style={{ width, height }}
			className={`animate-pulse bg-slate-300 ${variantClassNames[variant]}`}
		/>
	)
}

export default Skeleton
