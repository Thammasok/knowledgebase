#!/usr/bin/env node

/**
 * Module dependencies.
 */
import http from 'node:http'
import app from './boot/app'
import logger from './boot/logger'
import config from './config'
// import { mongoDBDisconnect } from '@/libs/db/mongo'
import db from './libs/db/prisma'

const port = normalizePort(config.PORT.toString() || '3030')
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Graceful shutdown handler
 */
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} signal received: starting graceful shutdown`)

  server.close(async (err: any) => {
    if (err) {
      logger.error('Error during server shutdown:', err)
      process.exit(1)
    }

    logger.info('HTTP server closed')

    try {
      // Close MongoDB connection
      // await mongoDBDisconnect()

      // Close Prisma connection
      await db.$disconnect()
      logger.info('Prisma disconnected')

      logger.info('Graceful shutdown completed')
      process.exit(0)
    } catch (error: any) {
      logger.error('Error during graceful shutdown:', error)
      process.exit(1)
    }
  })

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout')
    process.exit(1)
  }, 30000)
}

/**
 * Setup signal handlers for graceful shutdown
 */
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = Number.parseInt(val, 10)

  if (Number.isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr: any = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  logger.info('Listening on ' + bind)
}
