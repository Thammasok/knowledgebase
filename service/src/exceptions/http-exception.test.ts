import logger from '../boot/logger'
import HttpException from './http-exception'

describe('HttpException', () => {
  it('should create an instance with a status code and string error', () => {
    const exception = new HttpException(400, 'Bad Request')
    expect(exception.status).toBe(400)
    expect(exception.data).toBe('Bad Request')
    expect(exception.message).toBe('Bad Request')
  })

  it('should create an instance with a status code and Error object', () => {
    const error = new Error('Internal Server Error')
    const exception = new HttpException(500, error)
    expect(exception.status).toBe(500)
    expect(exception.data).toBe('Internal Server Error')
    expect(exception.message).toBe('Internal Server Error')
  })

  it('should create an instance with unknown error type', () => {
    const exception = new HttpException(400, { custom: 'error' })
    expect(exception.status).toBe(400)
    expect(exception.message).toBe('{"custom":"error"}')
    expect(exception.data).toContain('custom')
  })

  it('should set the error name to HttpException', () => {
    const exception = new HttpException(404, 'Not Found')
    expect(exception.name).toBe('HttpException')
  })

  it('should maintain prototype chain for instanceof checks', () => {
    const exception = new HttpException(403, 'Forbidden')
    expect(exception instanceof HttpException).toBe(true)
    expect(exception instanceof Error).toBe(true)
  })

  it('should handle number as error input', () => {
    const exception = new HttpException(400, 123)
    expect(exception.message).toBe('123')
    expect(exception.data).toBe('123')
  })

  it('should have proper stack trace', () => {
    const exception = new HttpException(500, 'Server Error')
    expect(exception.stack).toBeDefined()
    expect(exception.stack).toContain('HttpException')
  })
})