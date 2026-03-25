import db from '../../../libs/db/prisma'
import { DEFAULT_ACCOUNT_SETTING } from './setting.default'
import { Theme } from '../../../../generated/prisma/enums'

const LOGGER_NAME = 'ACCOUNT_SETTING_REPO:'

export const getAccountSetting = async (accountId: string) => {
  return await db.accountSetting.findUnique({
    where: {
      accountId,
    },
  })
}

export const createBasicAccountSetting = async (accountId: string) => {
  return await db.accountSetting.create({
    data: {
      accountId,
      theme: DEFAULT_ACCOUNT_SETTING.theme as Theme,
      language: DEFAULT_ACCOUNT_SETTING.language,
    },
  })
}

export interface IUpdateBasicSettingData {
  language?: string
  theme?: Theme
}

export const updateBasicAccountSetting = async (
  accountId: string,
  data: IUpdateBasicSettingData,
) => {
  return await db.accountSetting.update({
    where: {
      accountId,
    },
    data,
  })
}
