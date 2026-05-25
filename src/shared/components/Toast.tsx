import { useEffect, useRef } from 'react'

type ToastVariant = 'success' | 'error' | 'info'

type ToastProps = Readonly<{
	message: string
	variant: ToastVariant
	onClose: () => void
}>

const AUTO_CLOSE_DELAY_MS = 3000

const variantClassNames: Record<ToastVariant, string> = {
	success: 'bg-emerald-100 text-emerald-700',
	error: 'bg-red-100 text-red-700',
	info: 'bg-blue-100 text-blue-700'
}

function Toast({ message, variant, onClose }: ToastProps) {
	const timeoutRef = useRef<number | null>(null)

	function clearCloseTimeout() {
		if (timeoutRef.current) {
			window.clearTimeout(timeoutRef.current)
			timeoutRef.current = null
		}
	}

	function handleClose() {
		clearCloseTimeout()
		onClose()
	}

	useEffect(() => {
		timeoutRef.current = window.setTimeout(() => {
			timeoutRef.current = null
			onClose()
		}, AUTO_CLOSE_DELAY_MS)

		return () => {
			clearCloseTimeout()
		}
	}, [onClose])

	return (
		<div
			role='alert'
			aria-live='assertive'
			aria-atomic='true'
			className={`flex items-center justify-between gap-3 rounded-lg border border-current px-4 py-3 shadow-sm ${variantClassNames[variant]}`}
		>
			<p className='text-sm font-medium'>{message}</p>
			<button
				type='button'
				className='shrink-0 rounded-md border border-current px-3 py-1 text-sm font-medium cursor-pointer'
				onClick={handleClose}
				aria-label='Cerrar notificacion'
			>
				X
			</button>
		</div>
	)
}

export default Toast
