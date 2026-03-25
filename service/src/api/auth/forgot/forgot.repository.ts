import db from '../../../libs/db/prisma'
import * as Redis from '../../../libs/redis'

// ------------- Account -------------
export const getAccountByEmail = async (email: string) => {
  return await db.accounts.findUnique({
    where: {
      email,
      isRemove: false,
    },
  })
}

export const updatePassword = async (id: string, password: string) => {
  return await db.accounts.update({
    where: {
      id,
    },
    data: {
      password,
    },
  })
}

// ------------- Forgot Password -------------

export const getRequestResetPasswordByToken = async (token: string) => {
  return await Redis.getValue(`reset:${token}`)
}

export interface IUpdateRequestResetPasswordRepository {
  accountId: string
  token: string
  ttl: number
}

export const updateRequestResetPassword = async ({
  accountId,
  token,
  ttl,
}: IUpdateRequestResetPasswordRepository) => {
  return await Redis.setValue({
    key: `reset:${token}`,
    value: JSON.stringify(accountId),
    ttl: ttl,
  })
}

export const deleteRequestResetPassword = async (token: string) => {
  return await Redis.deleteValue(`reset:${token}`)
}
