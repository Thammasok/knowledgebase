import { createNewOTP, ICreateNewOTP } from '../otp.logic'

describe('OTP Generator', () => {
  it('should generate OTP with default options', () => {
    const result = createNewOTP()

    expect(result).toHaveProperty('otp')
    expect(result).toHaveProperty('ref')
    expect(result.otp).toHaveLength(6)
    expect(result.ref).toHaveLength(6)
    expect(result.otp).toMatch(/^\d+$/)
    expect(result.ref).toMatch(/^[A-Za-z0-9]+$/)
  })

  it('should generate OTP with uppercase alphabets', () => {
    const options: ICreateNewOTP = {
      upperCaseAlphabets: true,
    }
    const result = createNewOTP(options)

    expect(result.otp).toMatch(/^[0-9A-Z]+$/)
    expect(result.ref).toMatch(/^[A-Za-z0-9]+$/)
  })

  it('should generate OTP with lowercase alphabets', () => {
    const options: ICreateNewOTP = {
      lowerCaseAlphabets: true,
    }
    const result = createNewOTP(options)

    expect(result.otp).toMatch(/^[0-9a-z]+$/)
    expect(result.ref).toMatch(/^[A-Za-z0-9]+$/)
  })

  it('should generate OTP with special characters', () => {
    const options: ICreateNewOTP = {
      specialChars: true,
    }
    const result = createNewOTP(options)

    expect(result.otp).toMatch(/^[0-9!@#$%^&*]+$/)
    expect(result.ref).toMatch(/^[A-Za-z0-9]+$/)
  })

  it('should generate OTP with all character types', () => {
    const options: ICreateNewOTP = {
      upperCaseAlphabets: true,
      lowerCaseAlphabets: true,
      specialChars: true,
    }
    const result = createNewOTP(options)

    expect(result.otp).toMatch(/^[0-9A-Za-z!@#$%^&*]+$/)
    expect(result.ref).toMatch(/^[A-Za-z0-9]+$/)
  })

  it('should handle null options', () => {
    const result = createNewOTP(null)

    expect(result.otp).toMatch(/^\d+$/)
    expect(result.ref).toMatch(/^[A-Za-z0-9]+$/)
  })

  it('should generate unique OTPs and refs on multiple calls', () => {
    const result1 = createNewOTP()
    const result2 = createNewOTP()

    expect(result1.otp).not.toBe(result2.otp)
    expect(result1.ref).not.toBe(result2.ref)
  })
})
