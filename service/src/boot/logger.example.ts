/**
 * Example usage of pino logger
 *
 * This file demonstrates how to use the new pino-based logger.
 * You can delete this file after understanding the usage.
 */

import logger, {
  logInfo,
  logError,
  logWarn,
  logDebug,
  createChildLogger,
} from './logger'

// Basic logging examples
export const basicUsageExamples = () => {
  // Simple log messages
  logger.info('Application started')
  logger.error('An error occurred')
  logger.warn('This is a warning')
  logger.debug('Debug information')

  // Logs with additional context
  logger.info({ userId: '123', action: 'login' }, 'User logged in')
  logger.error({ userId: '123', error: 'Invalid password' }, 'Login failed')

  // Using helper functions
  logInfo('User authentication successful', { userId: '123', method: 'email' })
  logWarn('Rate limit approaching', { userId: '123', remaining: 5 })
  logDebug('Processing request', { requestId: 'req-456', path: '/api/users' })

  // Error logging with Error object
  try {
    throw new Error('Something went wrong')
  } catch (error: any) {
    logError('Failed to process request', error, { requestId: 'req-789' })
  }
}

// Child logger examples (useful for request-scoped logging)
export const childLoggerExamples = () => {
  // Create a child logger with persistent context
  const requestLogger = createChildLogger({
    requestId: 'req-123',
    userId: 'user-456',
  })

  // All logs from this child logger will include requestId and userId
  requestLogger.info('Processing user request')
  requestLogger.error('Request failed')

  // You can still add additional context to individual logs
  requestLogger.info({ action: 'update' }, 'User updated profile')
}

// Express middleware example
export const expressMiddlewareExample = () => {
  // Example Express middleware for request logging
  return (req: any, res: any, next: any) => {
    const requestLogger = createChildLogger({
      requestId: req.id,
      method: req.method,
      path: req.path,
      ip: req.ip,
    })

    // Add logger to request object for use in route handlers
    req.logger = requestLogger

    requestLogger.info('Incoming request')

    // Log response on finish
    res.on('finish', () => {
      requestLogger.info(
        {
          statusCode: res.statusCode,
          duration: Date.now() - req.startTime,
        },
        'Request completed',
      )
    })

    next()
  }
}

// Structured logging for different scenarios
export const structuredLoggingExamples = () => {
  // Database operation
  logInfo('Database query executed', {
    query: 'SELECT * FROM users WHERE id = ?',
    params: ['123'],
    duration: 45,
    rows: 1,
  })

  // API call
  logInfo('External API called', {
    service: 'payment-gateway',
    endpoint: '/charge',
    method: 'POST',
    statusCode: 200,
    duration: 1234,
  })

  // Business event
  logInfo('Order created', {
    orderId: 'ord-123',
    userId: 'user-456',
    amount: 99.99,
    currency: 'USD',
    items: 3,
  })

  // Error with full context
  logError('Payment processing failed', new Error('Insufficient funds'), {
    orderId: 'ord-123',
    userId: 'user-456',
    amount: 99.99,
    paymentMethod: 'credit_card',
  })
}

// Log levels demonstration
export const logLevelsExample = () => {
  // These are logged in order of severity (highest to lowest):
  logger.fatal('Fatal error - application cannot continue')
  logger.error('Error occurred but application can continue')
  logger.warn('Warning - something unexpected happened')
  logger.info('Informational message')
  logger.debug('Debug information for development')
  logger.trace('Very detailed tracing information')
}
