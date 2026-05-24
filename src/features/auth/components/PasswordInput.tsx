import { useEffect, useState } from 'react'
import { validatePassword } from '@shared/utils'

type PasswordInputProps = Readonly<{
	value: string
	onChange: (value: string) => void
	showRequirements: boolean
	onBlur?: () => void
	isInvalid?: boolean
}>

const REQUIREMENTS = [
	'At least 12 characters',
	'At least one uppercase letter',
	'At least one lowercase letter',
	'At least one number',
	'At least one special character'
] as const

const strengthStyles = {
	weak: {
		barClassName: 'bg-red-500',
		labelClassName: 'text-red-600',
		widthClassName: 'w-1/3'
	},
	medium: {
		barClassName: 'bg-yellow-400',
		labelClassName: 'text-yellow-600',
		widthClassName: 'w-2/3'
	},
	strong: {
		barClassName: 'bg-emerald-500',
		labelClassName: 'text-emerald-600',
		widthClassName: 'w-full'
	}
} as const

function EyeIcon() {
	return (
		<svg aria-hidden='true' viewBox='0 0 24 24' className='h-5 w-5 fill-none stroke-current' strokeWidth='1.8'>
			<path d='M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z' />
			<circle cx='12' cy='12' r='3' />
		</svg>
	)
}

function StatusIcon({ isValid }: Readonly<{ isValid: boolean }>) {
	if (isValid) {
		return (
			<svg
				aria-label='Valid'
				viewBox='0 0 24 24'
				className='h-5 w-5 text-emerald-500 fill-none stroke-current'
				strokeWidth='2'
			>
				<path d='m5 13 4 4L19 7' />
			</svg>
		)
	}

	return (
		<svg aria-label='Invalid' viewBox='0 0 24 24' className='h-5 w-5 text-red-500 fill-none stroke-current' strokeWidth='2'>
			<path d='M6 6 18 18' />
			<path d='M18 6 6 18' />
		</svg>
	)
}

function PasswordInput({ value, onChange, showRequirements, onBlur, isInvalid = false }: PasswordInputProps) {
	const [isVisible, setIsVisible] = useState(false)
	const [inputValue, setInputValue] = useState(value)
	const validation = validatePassword(inputValue)
	const strengthStyle = strengthStyles[validation.strength]

	useEffect(() => {
		setInputValue(value)
	}, [value])

	return (
		<div className='space-y-4'>
			<div className='space-y-2'>
				<div className='flex items-center gap-2'>
					<div className='relative flex-1'>
						<input
							type={isVisible ? 'text' : 'password'}
							aria-label='Password'
							value={inputValue}
							onChange={event => {
								setInputValue(event.target.value)
								onChange(event.target.value)
							}}
							onBlur={onBlur}
							className={`w-full rounded-md border px-3 py-2 pr-12 text-slate-950 ${isInvalid ? 'border-red-500' : 'border-slate-300'}`}
						/>
						<button
							type='button'
							aria-label={isVisible ? 'Hide value' : 'Show value'}
							onClick={() => {
								setIsVisible(currentValue => !currentValue)
							}}
							className='absolute inset-y-0 right-0 flex items-center px-3 text-slate-500'
						>
							<EyeIcon />
						</button>
					</div>
					<StatusIcon isValid={validation.isValid} />
				</div>

				<div className='space-y-1'>
					<div className='h-2 rounded-full bg-slate-200'>
						<div className={`h-2 rounded-full transition-all ${strengthStyle.barClassName} ${strengthStyle.widthClassName}`} />
					</div>
					<p className={`text-sm font-medium capitalize ${strengthStyle.labelClassName}`}>{validation.strength}</p>
				</div>
			</div>

			{showRequirements ? (
				<ul className='space-y-1 text-sm text-slate-600'>
					{REQUIREMENTS.map(requirement => (
						<li key={requirement}>{requirement}</li>
					))}
				</ul>
			) : null}
		</div>
	)
}

export default PasswordInput
