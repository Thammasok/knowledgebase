import db from '../../../libs/db/prisma'

export const getAccountByEmail = async (email: string) => {
  return await db.accounts.findUnique({
    where: {
      email,
      isRemove: false,
    },
  })
}
