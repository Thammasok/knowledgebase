import config from '../../../../config'
import * as jwt from '../../../../libs/jwt'
import { newToken } from '../login-token.logic'

jest.mock('@/boot/logger')
jest.mock('@/libs/jwt')
jest.mock('@/config', () => ({
  JWT: {
    ACCESS_TOKEN_EXPIRES_IN: '1H',
    REFRESH_TOKEN_EXPIRES_IN: '7D',
    JWT_SECRET: 'test-secret',
  },
}))

describe('Auth Service > Login Logic', () => {
  const mockAccountId = 'test-account-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should generate access and refresh tokens successfully', async () => {
    const mockAccessToken = 'mock-access-token'
    const mockRefreshToken = 'mock-refresh-token'

    ;(jwt.signAsync as jest.Mock)
      .mockResolvedValueOnce(mockAccessToken)
      .mockResolvedValueOnce(mockRefreshToken)

    const result = await newToken(mockAccountId)

    expect(result).toEqual({
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    })

    expect(jwt.signAsync).toHaveBeenCalledTimes(2)
    expect(jwt.signAsync).toHaveBeenNthCalledWith(
      1,
      {
        accountId: mockAccountId,
        sub: 'access_token',
      },
      config.JWT.JWT_SECRET,
      {
        expiresIn: config.JWT.ACCESS_TOKEN_EXPIRES_IN,
        algorithm: 'HS256',
      },
    )
    expect(jwt.signAsync).toHaveBeenNthCalledWith(
      2,
      {
        accountId: mockAccountId,
        sub: 'refresh_token',
      },
      config.JWT.JWT_SECRET,
      {
        expiresIn: config.JWT.REFRESH_TOKEN_EXPIRES_IN,
        algorithm: 'HS256',
      },
    )
  })

  it('should use default expiration times when config values are not set', async () => {
    const configWithoutExpiry = {
      JWT: {
        JWT_SECRET: 'test-secret',
      },
    }
    jest.resetModules()
    jest.mock('@/config', () => configWithoutExpiry)
    ;(jwt.signAsync as jest.Mock)
      .mockResolvedValueOnce('token1')
      .mockResolvedValueOnce('token2')

    await newToken(mockAccountId)

    expect(jwt.signAsync).toHaveBeenNthCalledWith(
      1,
      expect.any(Object),
      configWithoutExpiry.JWT.JWT_SECRET,
      expect.objectContaining({
        expiresIn: '1H',
      }),
    )
    expect(jwt.signAsync).toHaveBeenNthCalledWith(
      2,
      expect.any(Object),
      configWithoutExpiry.JWT.JWT_SECRET,
      expect.objectContaining({
        expiresIn: '7D',
      }),
    )
  })
})
