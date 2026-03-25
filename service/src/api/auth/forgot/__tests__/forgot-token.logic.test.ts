import otpGenerator from 'otp-generator'
import { createResetToken } from '../forgot-token.logic'

jest.mock('otp-generator')

describe('Auth Service > Forgot Token Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should generate a reset token with correct configuration', () => {
    const mockToken = 'MOCK_GENERATED_TOKEN'
    ;(otpGenerator.generate as jest.Mock).mockReturnValue(mockToken)

    const result = createResetToken()

    expect(result).toBe(mockToken)
    expect(otpGenerator.generate).toHaveBeenCalledWith(64, {
      upperCaseAlphabets: true,
      lowerCaseAlphabets: true,
      specialChars: false,
    })
    expect(otpGenerator.generate).toHaveBeenCalledTimes(1)
  })

  it('should return different tokens on subsequent calls', () => {
    const mockToken1 = 'MOCK_TOKEN_1'
    const mockToken2 = 'MOCK_TOKEN_2'
    ;(otpGenerator.generate as jest.Mock)
      .mockReturnValueOnce(mockToken1)
      .mockReturnValueOnce(mockToken2)

    const result1 = createResetToken()
    const result2 = createResetToken()

    expect(result1).toBe(mockToken1)
    expect(result2).toBe(mockToken2)
    expect(result1).not.toBe(result2)
  })

  it('should generate a token with length of 64 characters', () => {
    const mockToken = 'A'.repeat(64)
    ;(otpGenerator.generate as jest.Mock).mockReturnValue(mockToken)

    const result = createResetToken()

    expect(result.length).toBe(64)
  })
})
