import { EmailAlreadyExistsError } from './email-already-exists'

describe('EmailAlreadyExistsError', () => {
  it('should create an error with default message', () => {
    const error = new EmailAlreadyExistsError()
    expect(error.message).toBe('email already exists')
    expect(error.name).toBe('EmailAlreadyExistsError')
    expect(error).toBeInstanceOf(Error)
  })

  it('should create an error with custom message', () => {
    const customMessage = 'This email is already registered'
    const error = new EmailAlreadyExistsError(customMessage)
    expect(error.message).toBe(customMessage)
    expect(error.name).toBe('EmailAlreadyExistsError')
  })

  it('should be throwable', () => {
    expect(() => {
      throw new EmailAlreadyExistsError('test@example.com already exists')
    }).toThrow(EmailAlreadyExistsError)
  })

  it('should have correct prototype chain', () => {
    const error = new EmailAlreadyExistsError()
    expect(error instanceof EmailAlreadyExistsError).toBe(true)
    expect(error instanceof Error).toBe(true)
  })
})