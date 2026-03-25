import * as hash from '../../../utils/hash-password'
import * as AuthRepository from './login.repository'
import { newToken } from './login-token.logic'

export interface ILoginService {
  email: string
  password: string
}

export const login = async ({ email, password }: ILoginService) => {
  const account = await AuthRepository.getAccountByEmail(email)

  if (!account) {
    throw new TypeError('Email or password invalid')
  }

  const isMatch = await hash.comparePassword({
    password: password,
    hash: account.password || '',
  })

  if (!isMatch) {
    throw new TypeError('Email or password invalid')
  }

  const token = await newToken(account.id)

  return {
    token,
    account,
  }
}
