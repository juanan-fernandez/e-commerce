import { type FormEvent, useState } from 'react'
import * as Sentry from '@sentry/react'
import PasswordInput from './components/PasswordInput'
import { validatePassword } from '@shared/utils'

type FormStatus = 'idle' | 'success' | 'error' | 'locked'

const DEMO_EMAIL = 'demo@example.com'
const MAX_FAILED_ATTEMPTS = 3
const LOCKED_MESSAGE = 'Demasiados intentos fallidos. Formulario bloqueado.'

function isValidEmail(email: string): boolean {
	const [localPart, domain] = email.split('@')

	if (!localPart || !domain || email.includes(' ')) {
		return false
	}

	const domainParts = domain.split('.')

	return domainParts.length >= 2 && domainParts.every(part => part.length > 0)
}

function LoginDemo() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [failedAttempts, setFailedAttempts] = useState(0)
	const [status, setStatus] = useState<FormStatus>('idle')
	const [emailTouched, setEmailTouched] = useState(false)
	const [passwordTouched, setPasswordTouched] = useState(false)

	const isLocked = status === 'locked'
	const isFormValid = isValidEmail(email) && validatePassword(password).isValid
	const remainingAttempts = MAX_FAILED_ATTEMPTS - failedAttempts
	const isEmailInvalid = emailTouched && !isValidEmail(email)
	const isPasswordInvalid = passwordTouched && !validatePassword(password).isValid

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		if (!isFormValid || isLocked) {
			return
		}

		if (email === DEMO_EMAIL) {
			Sentry.setUser({
				id: email,
				email,
				username: email
			})

			setStatus('success')
			return
		}

		const nextFailedAttempts = failedAttempts + 1
		setFailedAttempts(nextFailedAttempts)

		if (nextFailedAttempts >= MAX_FAILED_ATTEMPTS) {
			setStatus('locked')
			return
		}

		setStatus('error')
	}

	return (
		<section className='mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
			<h2 className='text-2xl font-bold text-slate-950'>Login Demo</h2>
			<p className='mt-2 text-sm text-slate-500'>Usa {DEMO_EMAIL} para simular un acceso correcto.</p>

			<form className='mt-6 space-y-4' onSubmit={handleSubmit}>
				<fieldset disabled={isLocked} className='space-y-4 disabled:opacity-70'>
					<div className='space-y-2'>
						<label htmlFor='login-demo-email' className='block text-sm font-medium text-slate-700'>
							Email
						</label>
						<input
							id='login-demo-email'
							type='email'
							aria-label='Email'
							value={email}
							onChange={event => {
								setEmail(event.target.value)
								if (status !== 'locked') {
									setStatus('idle')
								}
							}}
							onBlur={() => {
								setEmailTouched(true)
							}}
							className={`w-full rounded-md border px-3 py-2 text-slate-950 outline-none ring-0 transition focus:border-cyan-500 ${isEmailInvalid ? 'border-red-500' : 'border-slate-300'}`}
						/>
					</div>

					<div className='space-y-2'>
						<span className='block text-sm font-medium text-slate-700'>Password</span>
						<PasswordInput
							value={password}
							onChange={nextPassword => {
								setPassword(nextPassword)
								if (status !== 'locked') {
									setStatus('idle')
								}
							}}
							onBlur={() => {
								setPasswordTouched(true)
							}}
							isInvalid={isPasswordInvalid}
							showRequirements={true}
						/>
					</div>
				</fieldset>

				<button
					type='submit'
					disabled={!isFormValid || isLocked}
					className='w-full rounded-md bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300'
				>
					Login
				</button>
			</form>

			{status === 'success' ? <p className='mt-4 text-sm font-medium text-emerald-600'>{`Bienvenido ${email}`}</p> : null}

			{status === 'error' ? (
				<p className='mt-4 text-sm font-medium text-red-600'>{`Credenciales invalidas. Te quedan ${remainingAttempts} intentos.`}</p>
			) : null}

			{status === 'locked' ? <p className='mt-4 text-sm font-medium text-red-700'>{LOCKED_MESSAGE}</p> : null}
		</section>
	)
}

export default LoginDemo
