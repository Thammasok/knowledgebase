import config from '../../../config'
import db from '../../../libs/db/prisma'
import { EmailAlreadyExistsError } from '../../../exceptions/email-already-exists'
import { isEmailUniqueConstraintError } from '../../../utils/db-utils'

export interface ICreateNewAccountRepository {
  displayName: string
  email: string
  password: string
  isVerify?: boolean
}

export const createNewAccount = async ({
  displayName,
  email,
  password,
  isVerify = false,
}: ICreateNewAccountRepository) => {
  try {
    return await db.accounts.create({
      data: {
        displayName,
        email,
        password,
        isVerify,
        image: config.ACCOUNT.PROFILE_IMAGE_DEFAULT,
        isRemove: false,
      },
    })
  } catch (error) {
    // Handle Prisma unique constraint violation for email field
    if (isEmailUniqueConstraintError(error)) {
      throw new EmailAlreadyExistsError('email already exists')
    }

    throw error
  }
}

export const createRequestAccess = async (email: string) => {
  try {
    return await db.accountRequestAccess.create({
      data: {
        email: email,
        allowed: false,
      },
    })
  } catch (error) {
    // Handle Prisma unique constraint violation for email field
    if (isEmailUniqueConstraintError(error)) {
      throw new EmailAlreadyExistsError('email already exists')
    }

    throw error
  }
}

export const deleteRequestAccessById = async (id: string) => {
  return await db.accountRequestAccess.delete({
    where: { id },
  })
}

export const getAccountByEmail = async (email: string) => {
  return await db.accounts.count({
    where: {
      email,
      isRemove: false,
    },
  })
}

export const getRequestAccessByEmail = async (email: string) => {
  return await db.accountRequestAccess.count({
    where: {
      email,
    },
  })
}

export const getRequestAccessById = async (id: string) => {
  return await db.accountRequestAccess.findUnique({
    where: {
      id,
    },
  })
}
