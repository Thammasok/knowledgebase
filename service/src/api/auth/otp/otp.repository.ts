import * as Redis from '../../../libs/redis'
import db from '../../../libs/db/prisma'
import { IOTP } from './otp.logic'

const LOGGER_NAME = 'AUTH_OTP_REPOSITORY:'

export const getAccountByEmail = async (email: string) => {
  return await db.accounts.findUnique({
    where: {
      email,
      isRemove: false,
    },
  })
}

export const updateVerifyAccount = async (accountId: string) => {
  return await db.accounts.update({
    where: {
      id: accountId,
    },
    data: {
      isVerify: true,
    },
  })
}

export const getOTPByAccountId = async (
  accountId: string,
): Promise<IOTP | null> => {
  return await Redis.getValue(`verify:${accountId}`)
}

export interface ISaveOTP {
  accountId: string
  otp: IOTP
  ttl: number
}

export const saveOTP = async ({ accountId, otp, ttl }: ISaveOTP) => {
  return await Redis.setValue({
    key: `verify:${accountId}`,
    value: JSON.stringify(otp),
    ttl: ttl,
  })
}

export const deleteOTPByAccountId = async (accountId: string) => {
  return await Redis.deleteValue(`verify:${accountId}`)
}
