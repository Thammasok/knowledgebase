import { verifyToken } from '../utils/jwt'

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Missing or invalid token' })

  try {
    const token = authHeader.split(' ')[1]
    const payload = verifyToken(token)
    req.user = payload // attach to request
    console.log(req.user)
    next()
  } catch (err) {
    console.error('Auth middleware error:', err)
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
