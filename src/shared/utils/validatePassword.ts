export type PasswordStrength = 'weak' | 'medium' | 'strong'

export type ValidatePasswordResult = {
	isValid: boolean
	errors: string[]
	strength: PasswordStrength
}

const MIN_LENGTH = 12
const MIN_LENGTH_ERROR = 'La contrasena debe tener al menos 12 caracteres'
const UPPERCASE_ERROR = 'La contrasena debe incluir al menos una letra mayuscula'
const LOWERCASE_ERROR = 'La contrasena debe incluir al menos una letra minuscula'
const NUMBER_ERROR = 'La contrasena debe incluir al menos un numero'
const SPECIAL_CHARACTER_ERROR = 'La contrasena debe incluir al menos un caracter especial'

export function validatePassword(password: string): ValidatePasswordResult {
	const errors: string[] = []

	if (password.length < MIN_LENGTH) {
		errors.push(MIN_LENGTH_ERROR)
	}

	if (!/[A-Z]/.test(password)) {
		errors.push(UPPERCASE_ERROR)
	}

	if (!/[a-z]/.test(password)) {
		errors.push(LOWERCASE_ERROR)
	}

	if (!/[0-9]/.test(password)) {
		errors.push(NUMBER_ERROR)
	}

	if (!/[!@#$%^&*(),.?":{}|<>\[\]\\/\-_=+`~;]/.test(password)) {
		errors.push(SPECIAL_CHARACTER_ERROR)
	}

	if (errors.length > 0) {
		return {
			isValid: false,
			errors,
			strength: 'weak'
		}
	}

	return {
		isValid: true,
		errors: [],
		strength: password.length >= 16 ? 'strong' : 'medium'
	}
}
