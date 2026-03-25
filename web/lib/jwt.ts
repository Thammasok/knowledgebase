import { jwtVerify, SignJWT } from 'jose'

export const JwtSign = async (
  payload: Record<string, unknown>,
  secret: string,
  options?: { expiresIn: string },
) => {
  const key = new TextEncoder().encode(secret)

  return await new SignJWT(payload)
    .setProtectedHeader({
      alg: 'HS256',
    })
    .setIssuedAt()
    .setExpirationTime(options?.expiresIn || '1d')
    .sign(key)
}

export const JwtVerify = async (token: string, secret: string) => {
  const key = new TextEncoder().encode(secret)
  const { payload } = await jwtVerify(token, key, {
    algorithms: ['HS256'],
  })

  return payload
}
