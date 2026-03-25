import pino from 'pino'

const env: string = process.env.NODE_ENV || 'development'

/**
 * Determine log level based on environment
 */
const getLogLevel = (): string => {
  const isDevelopment = !!(
    env === 'development' ||
    env === 'develop' ||
    env === 'local'
  )
  return isDevelopment ? 'debug' : 'info'
}

/**
 * Check if the environment is production
 */
const isProduction = (): boolean => {
  return env === 'production'
}

/**
 * Check if the process is running in test mode
 */
const isSilent = (): boolean => {
  return !!(process.argv.includes('--silent') || process.argv.includes('test'))
}

/**
 * Create pino logger instance with environment-specific configuration
 */
const logger = pino({
  name: 'dvi-happy-sure-all-service',
  level: isSilent() ? 'silent' : getLogLevel(),

  // Custom timestamp format
  timestamp: () => `,"time":"${new Date().toISOString()}"`,

  // Custom log formatting
  formatters: {
    level: (label: string) => {
      return { level: label.toUpperCase() }
    },
    bindings: (bindings: pino.Bindings) => {
      return {
        pid: bindings.pid,
        hostname: bindings.hostname,
        node_version: process.version,
        name: bindings.name,
      }
    },
  },

  // Base properties included in every log
  base: {
    env,
  },

  // Pretty print for development, JSON for production
  ...(!isProduction() && !isSilent()
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss.l',
            ignore: 'pid,hostname',
            singleLine: false,
            errorLikeObjectKeys: ['err', 'error'],
            errorProps: 'stack',
          },
        },
      }
    : {}),
})

// Custom log methods with structured logging support
export const logInfo = (message: string, context?: Record<string, any>) => {
  logger.info(context || {}, message)
}

export const logError = (
  message: string,
  error?: Error,
  context?: Record<string, any>,
) => {
  const errorContext = {
    ...context,
    ...(error
      ? {
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
        }
      : {}),
  }
  logger.error(errorContext, message)
}

export const logWarn = (message: string, context?: Record<string, any>) => {
  logger.warn(context || {}, message)
}

export const logDebug = (message: string, context?: Record<string, any>) => {
  logger.debug(context || {}, message)
}

// Child logger factory for creating logger with persistent context
export const createChildLogger = (context: Record<string, any>) => {
  return logger.child(context)
}

export default logger
