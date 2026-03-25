import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../../generated/prisma/client'
import config from '../../config'

const connectionString = process.env.DATABASE_URL || ''

const adapter = new PrismaPg({ connectionString })
const db = new PrismaClient({
  adapter,
  log:
    config.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
})

export default db
