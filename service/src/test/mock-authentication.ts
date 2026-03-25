import { NextFunction, Request, Response } from 'express'

export type MockAuthenTypes = {
  isMock: boolean
  sessionId: string
  userId: string
  sessionClaims: {
    azp: string
    exp: number
    iat: number
    iss: string
    nbf: number
    sid: string
    sub: string
  }
  claims: {
    azp: string
    exp: number
    iat: number
    iss: string
    nbf: number
    sid: string
    sub: string
  }
}

declare global {
  namespace Express {
    interface Request {
      auth?: MockAuthenTypes
    }
  }
}

const MockAuthentication = () => {
  return async function (req: Request, res: Response, next: NextFunction) {
    req.auth = {
      isMock: true,
      sessionId: 'sess_2foGntxQJhwkA7oAZhkjY26WLBD',
      userId: 'user_2fm6BouniQFeeZPWfetSWeo8whe',
      sessionClaims: {
        azp: 'https://localhost:3000',
        exp: 1714466746,
        iat: 1714466686,
        iss: 'https://magnetic-hermit-66.clerk.accounts.dev',
        nbf: 1714466676,
        sid: 'sess_2foGntxQJhwkA7oAZhkjY26WLBD',
        sub: 'user_2fm6BouniQFeeZPWfetSWeo8whe',
      },
      claims: {
        azp: 'https://localhost:3000',
        exp: 1714466746,
        iat: 1714466686,
        iss: 'https://magnetic-hermit-66.clerk.accounts.dev',
        nbf: 1714466676,
        sid: 'sess_2foGntxQJhwkA7oAZhkjY26WLBD',
        sub: 'user_2fm6BouniQFeeZPWfetSWeo8whe',
      },
    }

    next()
  }
}

export default MockAuthentication
