import { describe, expect, it } from 'vitest'
import { validatePassword } from './validatePassword'

const MIN_LENGTH_ERROR = 'La contrasena debe tener al menos 12 caracteres'
const UPPERCASE_ERROR = 'La contrasena debe incluir al menos una letra mayuscula'
const LOWERCASE_ERROR = 'La contrasena debe incluir al menos una letra minuscula'
const NUMBER_ERROR = 'La contrasena debe incluir al menos un numero'
const SPECIAL_CHARACTER_ERROR = 'La contrasena debe incluir al menos un caracter especial'

describe('validatePassword', () => {
	it('fails with fewer than 12 characters', () => {
		expect(validatePassword('Aa1!aaaaaaa')).toEqual({
			isValid: false,
			errors: [MIN_LENGTH_ERROR],
			strength: 'weak',
		})
	})

	it('fails without an uppercase letter', () => {
		expect(validatePassword('lowercase1!x')).toEqual({
			isValid: false,
			errors: [UPPERCASE_ERROR],
			strength: 'weak',
		})
	})

	it('fails without a lowercase letter', () => {
		expect(validatePassword('UPPERCASE1!X')).toEqual({
			isValid: false,
			errors: [LOWERCASE_ERROR],
			strength: 'weak',
		})
	})

	it('fails without a number', () => {
		expect(validatePassword('NoNumber!!!!a')).toEqual({
			isValid: false,
			errors: [NUMBER_ERROR],
			strength: 'weak',
		})
	})

	it('fails without a special character', () => {
		expect(validatePassword('NoSpecial123A')).toEqual({
			isValid: false,
			errors: [SPECIAL_CHARACTER_ERROR],
			strength: 'weak',
		})
	})

	it('returns weak strength for invalid passwords', () => {
		expect(validatePassword('NoSpecial123A').strength).toBe('weak')
	})

	it('returns medium strength for valid passwords between 12 and 15 characters', () => {
		expect(validatePassword('ValidPass12!')).toEqual({
			isValid: true,
			errors: [],
			strength: 'medium',
		})
	})

	it('returns strong strength for valid passwords with 16 or more characters', () => {
		expect(validatePassword('VeryStrongPass12!')).toEqual({
			isValid: true,
			errors: [],
			strength: 'strong',
		})
	})

	it('returns isValid true and empty errors for a valid password', () => {
		expect(validatePassword('SecurePass12!')).toEqual({
			isValid: true,
			errors: [],
			strength: 'medium',
		})
	})
})
