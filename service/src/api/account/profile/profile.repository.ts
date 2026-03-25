import db from '../../../libs/db/prisma'

export const getAccountById = async (id: string) => {
  return await db.accounts.findUnique({
    where: {
      id,
      isRemove: false,
    },
  })
}

export const getAccountProfileById = async (id: string) => {
  return await db.accounts.findUnique({
    where: {
      id,
      isRemove: false,
    },
    select: {
      password: false,
      source: false,
      isRemove: false,
    },
  })
}

export const updateAccountProfileById = async (
  id: string,
  data: { displayName?: string; firstName?: string; lastName?: string },
) => {
  return await db.accounts.update({
    where: { id, isRemove: false },
    data,
    select: {
      id: true,
      displayName: true,
      firstName: true,
      lastName: true,
      email: true,
      image: true,
    },
  })
}
