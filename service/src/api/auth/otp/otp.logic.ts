import otpGenerator from 'otp-generator'

export interface IOTP {
  otp: string
  ref: string
}

export interface ICreateNewOTP {
  upperCaseAlphabets?: boolean
  lowerCaseAlphabets?: boolean
  specialChars?: boolean
}

export const createNewOTP = (options?: ICreateNewOTP | null): IOTP => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: options?.upperCaseAlphabets || false,
    lowerCaseAlphabets: options?.lowerCaseAlphabets || false,
    specialChars: options?.specialChars || false,
  })

  const ref = otpGenerator.generate(6, {
    upperCaseAlphabets: true,
    lowerCaseAlphabets: true,
    specialChars: false,
  })

  return { otp, ref }
}
