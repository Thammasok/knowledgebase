import config from '../../../config'
import db from '../../../libs/db/prisma'
import { isEmailUniqueConstraintError } from '../../../utils/db-utils'
import { EmailAlreadyExistsError } from '../../../exceptions/email-already-exists'

export const getAccountByEmail = async (email: string) => {
  return await db.accounts.findUnique({
    where: { email, isRemove: false },
  })
}

export interface ICreateOAuthAccount {
  displayName: string
  email: string
  image?: string
  provider: string
}

export const createOAuthAccount = async ({
  displayName,
  email,
  image,
  provider,
}: ICreateOAuthAccount) => {
  try {
    return await db.accounts.create({
      data: {
        displayName,
        email,
        password: crypto.randomUUID(),
        isVerify: true,
        isExternalAccount: true,
        externalProvider: provider,
        image: image || config.ACCOUNT.PROFILE_IMAGE_DEFAULT,
        isRemove: false,
      },
    })
  } catch (error) {
    if (isEmailUniqueConstraintError(error)) {
      throw new EmailAlreadyExistsError('email already exists')
    }
    throw error
  }
}
