import * as Sentry from '@sentry/react'

const SENTRY_TEST_MESSAGE = 'Sentry configuration test from development header'

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

export function isDevelopmentEnvironment(): boolean {
	return import.meta.env.DEV
}

export function captureSentryTestError() {
	Sentry.captureException(new Error(SENTRY_TEST_MESSAGE))
}
