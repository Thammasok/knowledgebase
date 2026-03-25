import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { NextFunction, Request, Response } from 'express'
import HttpException from '../exceptions/http-exception'
import { logError } from '../boot/logger'
import { Prisma } from '../../generated/prisma/client'

const env = process.env.NODE_ENV || 'development'
const isProduction = env === 'production'

/**
 * Error response interface
 */
interface ErrorResponse {
    type: string
    message: string
    statusCode: number
    timestamp: string
    path?: string
    details?: any
    stack?: string
}

/**
 * Handle Joi validation errors
 */
const handleJoiValidationError = (error: Joi.ValidationError): ErrorResponse => {
  const details = error.details.map((detail) => ({
    field: detail.path.join('.'),
    message: detail.message,
    type: detail.type,
  }))

  return {
    type: 'ValidationError',
    message: 'Validation failed',
    statusCode: StatusCodes.BAD_REQUEST,
    timestamp: new Date().toISOString(),
    details,
  }
}

/**
 * Handle Prisma errors
 */
const handlePrismaError = (
  error: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientUnknownRequestError,
): ErrorResponse => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle specific Prisma error codes
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        return {
            type: 'ConflictError',
            message: 'A record with this value already exists',
            statusCode: StatusCodes.CONFLICT,
            timestamp: new Date().toISOString(),
            details: !isProduction ? { target: error.meta?.target } : undefined,
        }
      case 'P2025':
        // Record not found
        return {
            type: 'NotFoundError',
            message: 'Record not found',
            statusCode: StatusCodes.NOT_FOUND,
            timestamp: new Date().toISOString(),
        }
      case 'P2003':
        // Foreign key constraint violation
        return {
            type: 'BadRequestError',
            message: 'Invalid reference to related record',
            statusCode: StatusCodes.BAD_REQUEST,
            timestamp: new Date().toISOString(),
        }
      default:
        return {
            type: 'DatabaseError',
            message: isProduction ? 'Database operation failed' : error.message,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            timestamp: new Date().toISOString(),
            details: !isProduction ? { code: error.code } : undefined,
        }
    }
  }

  // Unknown Prisma error
  return {
      type: 'DatabaseError',
      message: isProduction ? 'Database error occurred' : error.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
  }
}

/**
 * Handle HttpException errors
 */
const handleHttpException = (error: HttpException, path?: string): ErrorResponse => {
  return {
      type: error.name || 'HttpException',
      message: error.message || 'An error occurred',
      statusCode: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path,
      details: !isProduction && error.data ? error.data : undefined,
      stack: !isProduction ? error.stack : undefined,
  }
}

/**
 * Handle unknown errors
 */
const handleUnknownError = (error: Error, path?: string): ErrorResponse => {
  return {
      type: 'InternalServerError',
      message: isProduction ? 'An unexpected error occurred' : error.message || 'Something went wrong',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path,
      stack: !isProduction ? error.stack : undefined,
  }
}

/**
 * Express error middleware
 */
const errorMiddleware = (
  error: Error | HttpException | Joi.ValidationError,
  request: Request,
  response: Response,
  _next: NextFunction,
) => {
  let errorResponse: ErrorResponse

  // Determine error type and create appropriate response
  if (error instanceof HttpException) {
    errorResponse = handleHttpException(error, request.path)
  } else if (error.name === 'ValidationError' && 'details' in error) {
    errorResponse = handleJoiValidationError(error as Joi.ValidationError)
  } else if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    errorResponse = handlePrismaError(error)
  } else {
    errorResponse = handleUnknownError(error, request.path)
  }

  // Log error with context
  logError('Request error occurred', error, {
    method: request.method,
    path: request.path,
    statusCode: errorResponse.statusCode,
    errorType: errorResponse.type,
    ip: request.ip,
    userAgent: request.get('user-agent'),
  })

  // Send error response
  return response
    .status(errorResponse.statusCode)
    .set('Content-Type', 'application/json')
    .json({
      message: errorResponse.message,
    })
}

export default errorMiddleware
