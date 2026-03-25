export interface IPasswordCheck {
  condition: string
  isValid: boolean
  message: string
}

export interface IPasswordValidationResult {
  isOverallValid: boolean
  checks: IPasswordCheck[]
}

export const validatePassword = (
  password: string,
): IPasswordValidationResult => {
  const checks: IPasswordCheck[] = [
    {
      condition: 'minLength',
      isValid: password.length >= 8,
      message: 'Password must be at least 8 characters long',
    },
    {
      condition: 'uppercase',
      isValid: /[A-Z]/.test(password),
      message: 'Password must contain at least 1 uppercase letter',
    },
    {
      condition: 'lowercase',
      isValid: /[a-z]/.test(password),
      message: 'Password must contain at least 1 lowercase letter',
    },
    {
      condition: 'number',
      isValid: /\d/.test(password),
      message: 'Password must contain at least 1 number',
    },
    {
      condition: 'specialChar',
      isValid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      message: 'Password must contain at least 1 special character',
    },
  ]

  const isOverallValid = checks.every((check) => check.isValid)

  return {
    isOverallValid,
    checks,
  }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return emailRegex.test(email)
}
