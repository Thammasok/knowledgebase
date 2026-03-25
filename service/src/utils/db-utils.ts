export const calculateSkip = (page: number, perPage: number) =>
  page - 1 > 0 ? (page - 1) * perPage : 0


// Check if error is Prisma unique constraint error related to email
export const isEmailUniqueConstraintError = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  const errorObj = error as Record<string, unknown>

  // Check for Prisma error code P2002 (unique constraint violation)
  const hasCode = errorObj.code === 'P2002'
  
  // Check error message for unique constraint on email
  const message = typeof errorObj.message === 'string' ? errorObj.message : ''
  const hasEmailConstraintMessage = 
    message.includes('Unique constraint failed on the fields: (`email`)') ||
    message.includes('Unique constraint') && message.includes('email')

  // Check meta.target for email field
  const meta = errorObj.meta as { target?: string[] } | undefined
  const hasEmailTarget = meta?.target?.includes('email') === true

  return hasCode || hasEmailConstraintMessage || hasEmailTarget
}