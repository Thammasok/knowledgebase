import * as bcrypt from 'bcrypt'

type ComparePasswordDto = {
  password: string
  hash: string
}

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10)
}

export const comparePassword = async ({
  password,
  hash,
}: ComparePasswordDto) => {
  return await bcrypt.compare(password, hash)
}
