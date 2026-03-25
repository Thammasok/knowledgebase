class HttpException extends Error {
  public status: number
  public data: Error | string | undefined

  constructor(status: number, error: Error | string | unknown) {
    // Handle error message safely
    const message = error instanceof Error
      ? error.message
      : typeof error === 'string' ? error : JSON.stringify(error)
    super(message)

    // Set error name for better stack traces
    this.name = 'HttpException'
    this.status = status

    // Maintain prototype chain for instanceof checks
    Object.setPrototypeOf(this, HttpException.prototype)

    if (error instanceof Error) {
      this.data = error.message
      return
    }

    this.data = typeof error === 'string' ? error : JSON.stringify(error)
  }
}

export default HttpException
