import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'super-secret'

export const generateToken = (payload: string) => {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET)
}
