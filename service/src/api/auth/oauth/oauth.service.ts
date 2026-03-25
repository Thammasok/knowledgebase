import * as OAuthRepository from './oauth.repository'
import { newToken } from '../login/login-token.logic'

export interface IOAuthService {
  provider: string
  providerId: string
  email: string
  displayName: string
  image?: string
}

export const oauthSignIn = async ({
  provider,
  email,
  displayName,
  image,
}: IOAuthService) => {
  let account = await OAuthRepository.getAccountByEmail(email)

  if (!account) {
    account = await OAuthRepository.createOAuthAccount({
      displayName,
      email,
      image,
      provider,
    })
  }

  const token = await newToken(account.id)

  return {
    token,
    account: {
      displayName: account.displayName,
      email: account.email,
      image: account.image,
      isVerify: account.isVerify,
    },
  }
}
