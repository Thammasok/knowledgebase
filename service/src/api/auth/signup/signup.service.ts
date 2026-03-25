import config from '../../../config'
import HttpException from '../../../exceptions/http-exception'
import { EmailAlreadyExistsError } from '../../../exceptions/email-already-exists'
import { StatusCodes } from 'http-status-codes'
import * as hash from '../../../utils/hash-password'
import * as AuthSignupRepository from './signup.repository'

// Create new account
export interface ICreateNewAccountService {
  displayName: string
  email: string
  password: string
}

export const createNewAccount = async ({
  email,
  displayName,
  password,
}: ICreateNewAccountService) => {
  try {
    const hashPassword = await hash.hashPassword(password)

    const account = await AuthSignupRepository.createNewAccount({
      email,
      displayName,
      password: hashPassword,
    })

    // send otp
    await getEmailVerify(displayName, email)

    return account
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      throw new HttpException(StatusCodes.CONFLICT, error.message)
    }

    throw error
  }
}

export const createRequestAccess = async (email: string) => {
  try {
    const isAlreadyAccount = await AuthSignupRepository.getAccountByEmail(email)
    const isAlreadyRequest =
      await AuthSignupRepository.getRequestAccessByEmail(email)

    if (isAlreadyAccount > 0) {
      throw new HttpException(StatusCodes.CONFLICT, 'account already exists')
    }

    if (isAlreadyRequest > 0) {
      throw new HttpException(StatusCodes.CONFLICT, 'email already exists')
    }

    return await AuthSignupRepository.createRequestAccess(email)
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      throw new HttpException(StatusCodes.CONFLICT, error.message)
    }

    throw error
  }
}

export interface ICreateNewAccountByRequestService {
  requestId: string
  displayName: string
  password: string
}

export const createNewAccountByRequest = async ({
  requestId,
  displayName,
  password,
}: ICreateNewAccountByRequestService) => {
  try {
    const request = await AuthSignupRepository.getRequestAccessById(requestId)

    if (!request) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'request not found')
    }

    const hashPassword = await hash.hashPassword(password)
    const account = await AuthSignupRepository.createNewAccount({
      email: request.email,
      displayName,
      password: hashPassword,
      isVerify: true,
    })

    await AuthSignupRepository.deleteRequestAccessById(requestId)

    return account
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      throw new HttpException(StatusCodes.CONFLICT, error.message)
    }

    throw error
  }
}

// 3rd party
export const getEmailVerify = async (displayName: string, email: string) => {
  // call service to send otp to email
  await fetch(`${config.INTERNAL.OTP_API_SERVICE}/api/v1/auth/verify/mail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: displayName,
      email
    }),
  })
}
