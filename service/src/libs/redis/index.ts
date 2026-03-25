import { createClient, RedisClientType } from 'redis'
import { SetValueRedisDto } from './radis.dto'
import logger from '../../boot/logger'

const LOGGER_NAME = 'REDIS_LIBS:'

export const redisInitial = async (): Promise<RedisClientType> => {
  try {
    const client = await createClient({
      url: process.env.DATABASE_REDIS_URL,
    })
      .on('error', (err) => {
        logger.error(LOGGER_NAME, err)

        throw err
      })
      .connect()

    return client as RedisClientType
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    throw error
  }
}

export const setValue = async ({ key, value, ttl }: SetValueRedisDto) => {
  try {
    const redis = await redisInitial()

    if (ttl) {
      redis.setEx(key, ttl, value)
    } else {
      redis.set(key, value)
    }

    redis.quit()

    return true
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    throw error
  }
}

export const getValue = async (key: string) => {
  try {
    const redis = await redisInitial()

    const result = await redis.get(key)
    redis.quit()

    if (result) {
      return JSON.parse(result)
    }

    return null
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    throw error
  }
}

export const deleteValue = async (key: string) => {
  try {
    const redis = await redisInitial()

    redis.del(key)
    redis.quit()

    return true
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    throw error
  }
}
