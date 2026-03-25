import otpGenerator from 'otp-generator'

export const createResetToken = () => {
  const token = otpGenerator.generate(64, {
    upperCaseAlphabets: true,
    lowerCaseAlphabets: true,
    specialChars: false,
  })

  return token
}