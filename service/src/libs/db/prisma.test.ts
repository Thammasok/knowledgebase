import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../../generated/prisma/client'
import config from '../../config'
const prisma = require('./prisma').default

jest.mock('@prisma/adapter-pg')
jest.mock('../../../generated/prisma/client')
jest.mock('../../config')

describe('prisma.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    delete process.env.DATABASE_URL
  })

  it('should create PrismaPg adapter with DATABASE_URL from environment', async () => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb'
    await jest.isolateModulesAsync(async () => {
      const { PrismaPg: IsolatedPrismaPg } = await import('@prisma/adapter-pg')
      await import('./prisma')
      expect(IsolatedPrismaPg).toHaveBeenCalledWith({
        connectionString: 'postgresql://test:test@localhost:5432/testdb',
      })
    })
  })

  it('should create PrismaPg adapter with empty string when DATABASE_URL is not set or is empty', async () => {
    // prisma.ts imports `dotenv/config`, which can populate DATABASE_URL from a local .env.
    // Setting it to an empty string ensures dotenv will not overwrite it and Prisma uses "".
    process.env.DATABASE_URL = ''

    await jest.isolateModulesAsync(async () => {
      const { PrismaPg: IsolatedPrismaPg } = await import('@prisma/adapter-pg')
      await import('./prisma')
      expect(IsolatedPrismaPg).toHaveBeenCalledWith({
        connectionString: '',
      })
    })
  })

  it('should configure logging for development environment', async () => {
    ;(config as jest.Mocked<typeof config>).NODE_ENV = 'development'
    await jest.isolateModulesAsync(async () => {
      const { PrismaClient: IsolatedPrismaClient } = await import(
        '../../../generated/prisma/client'
      )
      await import('./prisma')
      expect(IsolatedPrismaClient).toHaveBeenCalledWith(
        expect.objectContaining({
          log: ['query', 'info', 'warn', 'error'],
        })
      )
    })
  })

  it('should configure logging for production environment', async () => {
    ;(config as jest.Mocked<typeof config>).NODE_ENV = 'production'
    await jest.isolateModulesAsync(async () => {
      const { PrismaClient: IsolatedPrismaClient } = await import(
        '../../../generated/prisma/client'
      )
      await import('./prisma')
      expect(IsolatedPrismaClient).toHaveBeenCalledWith(
        expect.objectContaining({
          log: ['error'],
        })
      )
    })
  })

  it('should export PrismaClient instance as default', () => {
    const mockClient = {}
    ;(PrismaClient as jest.Mock).mockImplementation(() => mockClient)

    expect(prisma).toBeDefined()
  })
})