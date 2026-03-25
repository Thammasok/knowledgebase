import jwt, { SignOptions } from 'jsonwebtoken'
import { signAsync, verifyAsync } from './index'
import logger from '../../boot/logger'

jest.mock('jsonwebtoken')

jest.mock('../../boot/logger', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}))

describe('JWT_LIBS', () => {
  const mockPayload = { userId: '123', email: 'test@example.com' }
  const mockSecret = 'test-secret'
  const mockToken = 'mock.jwt.token'
  const mockSignOptions: SignOptions = {
    expiresIn: '1h', // or '1h' as undefined
  };
  const mockVerifyOptions = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('signAsync', () => {
    it('should sign payload and return token', async () => {
      ;(jwt.sign as jest.Mock).mockReturnValue(mockToken)

      const result = await signAsync(mockPayload, mockSecret, mockSignOptions)

      expect(jwt.sign).toHaveBeenCalledWith(
        mockPayload,
        mockSecret,
        mockSignOptions,
      )
      expect(result).toBe(mockToken)
    })

    it('should log error and rethrow on sign failure', async () => {
      const mockError = new Error('Sign failed')
      ;(jwt.sign as jest.Mock).mockImplementation(() => {
        throw mockError
      })

      await expect(signAsync(mockPayload, mockSecret, mockSignOptions)).rejects.toThrow(
        mockError,
      )
      expect(logger.error).toHaveBeenCalledWith({
        type: 'JWT_LIBS:',
        error: mockError,
      })
    })
  })

  describe('verifyAsync', () => {
    it('should verify token and return decoded payload', async () => {
      ;(jwt.verify as jest.Mock).mockReturnValue(mockPayload)

      const result = await verifyAsync(mockToken, mockSecret, mockVerifyOptions)

      expect(jwt.verify).toHaveBeenCalledWith(
        mockToken,
        mockSecret,
        mockVerifyOptions,
      )
      expect(result).toEqual(mockPayload)
    })

    it('should log error and rethrow on verify failure', async () => {
      const mockError = new Error('Invalid token')
      ;(jwt.verify as jest.Mock).mockImplementation(() => {
        throw mockError
      })

      await expect(
        verifyAsync(mockToken, mockSecret, mockVerifyOptions),
      ).rejects.toThrow(mockError)
      expect(logger.error).toHaveBeenCalledWith({
        type: 'JWT_LIBS:',
        error: mockError,
      })
    })
  })
})