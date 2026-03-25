import * as PasswordUtil from './hash-password'
import logger from '../boot/logger'

const LOGGER_NAME = 'HASH_PASSWORD_TEST:'

describe('Utils > Hash Password', () => {
  it('should hash password is correct', async () => {
    try {
      // Arrange
      const password = 'Jaranchai@123451233'

      // Act
      const actual = await PasswordUtil.hashPassword(password)

      // Assert
      expect(password).not.toBe(actual)
    } catch (error) {
      logger.error({ type: LOGGER_NAME, error })

      throw error
    }
  })

  it('should compare password with hash is correct', async () => {
    try {
      // Arrange
      const password = 'Jaranchai@12345'
      const expected =
        '$2b$10$AsEr4WzjV5c.Bx6N3R6R9O6NLh5wWa.JVNB69jrhc8WaND25nhIui'

      // Act
      const actual = await PasswordUtil.comparePassword({
        password,
        hash: expected,
      })

      // Assert
      expect(actual).toBeTruthy()
    } catch (error) {
      logger.error(error)

      throw error
    }
  })

  it('should compare password with hash is incorrect', async () => {
    try {
      // Arrange
      const password = 'Jaranchai@12345'
      const hash =
        '$2b$10$J1hlQEDl65VAdN7QBifnreV1MJ3Rk55X0sqgsbx7fX7/kpN9uCYI6'

      // Act
      const actual = await PasswordUtil.comparePassword({
        password,
        hash,
      })

      // Assert
      expect(actual).toBeFalsy()
    } catch (error) {
      logger.error(error)

      throw error
    }
  })
})
