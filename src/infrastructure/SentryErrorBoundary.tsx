import type { ReactNode } from 'react'
import * as Sentry from '@sentry/react'

type SentryErrorBoundaryProps = Readonly<{
	children: ReactNode
}>

type ErrorFallbackProps = Readonly<{
	error: unknown
	resetError: () => void
	eventId?: string
}>

function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message
	}

	return 'Ha ocurrido un error inesperado.'
}

function getErrorTitle(error: unknown): string {
	if (error instanceof Error && error.name) {
		return error.name
	}

	return 'Error inesperado'
}

function ErrorFallback({ error, resetError, eventId }: ErrorFallbackProps) {
	const errorTitle = getErrorTitle(error)
	const errorMessage = getErrorMessage(error)

	return (
		<section
			role='alert'
			aria-live='assertive'
			className='mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white p-6 text-slate-950 shadow-sm'
		>
			<div className='flex items-start gap-4'>
				<div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700'>
					<svg aria-hidden='true' viewBox='0 0 24 24' className='h-6 w-6' fill='none' stroke='currentColor' strokeWidth='1.8'>
						<circle cx='12' cy='12' r='9' />
						<path d='M12 7v6' />
						<circle cx='12' cy='16.5' r='0.75' fill='currentColor' stroke='none' />
					</svg>
				</div>

				<div className='min-w-0 flex-1'>
					<p className='text-sm font-semibold uppercase tracking-[0.2em] text-red-600'>Application Error</p>
					<h2 className='mt-1 text-2xl font-bold text-slate-950'>Algo salio mal</h2>
					<p className='mt-2 text-sm leading-6 text-slate-600'>
						Se ha producido un error inesperado y el problema ha sido reportado automaticamente.
						 Puedes volver a intentarlo o recargar la pagina.
					</p>

					<div className='mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4'>
						<p className='text-sm font-semibold text-slate-900'>{errorTitle}</p>
						<p className='mt-1 text-sm text-slate-600'>{errorMessage}</p>
						{eventId ? <p className='mt-3 text-xs font-medium text-slate-500'>Referencia Sentry: {eventId}</p> : null}
					</div>

					<div className='mt-5 flex flex-wrap gap-3'>
						<button
							type='button'
							className='cursor-pointer rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800'
							onClick={resetError}
						>
							Reintentar
						</button>
						<button
							type='button'
							className='cursor-pointer rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50'
							onClick={() => {
								window.location.reload()
							}}
						>
							Recargar pagina
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}

function SentryErrorBoundary({ children }: SentryErrorBoundaryProps) {
	return (
		<Sentry.ErrorBoundary
			fallback={({ error, resetError, eventId }) => (
				<ErrorFallback error={error} resetError={resetError} eventId={eventId} />
			)}
		>
			{children}
		</Sentry.ErrorBoundary>
	)
}

export default SentryErrorBoundary
