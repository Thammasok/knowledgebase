import axios, { AxiosError } from 'axios'

type ErrorResponse = {
  message?: string | string[]
  error?: string
  statusCode?: number
}

export type CustomServiceErrorType = {
  error: boolean
  statusCode?: number
  type: string
  message: string | string[]
} | null

const getErrorMessage = (data: unknown): string | string[] => {
  if (!data) return 'An unknown error occurred'

  if (typeof data === 'string') return data

  if (Array.isArray(data)) return data

  if (typeof data === 'object') {
    const errorData = data as ErrorResponse
    if (errorData.message) return errorData.message
    if (errorData.error) return errorData.error
  }

  return 'An unexpected error occurred'
}

const customServiceError = (error: unknown): CustomServiceErrorType => {
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>
    // Network error (no response from server)
    if (error.code === 'ERR_NETWORK') {
      return {
        error: true,
        statusCode: 503,
        type: 'network_error',
        message:
          'Unable to connect to the server. Please check your network connection.',
      }
    }

    // Rate limiting (429)
    if (error.code === 'ERR_BAD_REQUEST' && error.response?.status === 429) {
      return {
        error: true,
        statusCode: 429,
        type: 'rate_limit_exceeded',
        message: 'Too many requests. Please wait a moment and try again.',
      }
    }

    // Handle other API errors
    if (error.response) {
      return {
        error: true,
        statusCode: error.response.status,
        type: error.response.statusText || 'api_error',
        message: getErrorMessage(axiosError.response?.data),
      }
    }
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    return {
      error: true,
      type: error.name,
      message: error.message,
    }
  }

  return {
    error: true,
    type: 'error',
    message: 'An unknown error occurred',
  }
}

export default customServiceError
