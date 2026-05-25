import * as Sentry from '@sentry/react'

export function initSentry() {
	const dsn = import.meta.env.VITE_SENTRY_DSN

	if (!dsn) {
		console.warn('Sentry DSN not configured')
		return
	}

	Sentry.init({
		dsn,
		environment: import.meta.env.VITE_ENV || 'development',
		integrations: [
			Sentry.browserTracingIntegration(),
			Sentry.replayIntegration(),
		],
		tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
		replaysSessionSampleRate: 0.1,
		replaysOnErrorSampleRate: 1.0,
	})
}
