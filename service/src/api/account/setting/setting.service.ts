import { StatusCodes } from 'http-status-codes'
import HttpException from '../../../exceptions/http-exception'
import { DEFAULT_ACCOUNT_SETTING } from '../../../api/account/setting/setting.default'
import * as AccountSettingRepository from './setting.repository'
import { Theme } from '../../../../generated/prisma/enums'

export const getAccountSetting = async (accountId: string) => {
  const setting = await AccountSettingRepository.getAccountSetting(accountId)

  if (!setting) {
    const result =
      await AccountSettingRepository.createBasicAccountSetting(accountId)

    if (!result) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        'Cannot create basic setting',
      )
    }

    return result
  }

  return setting
}

export const updateBasicSetting = async (
  accountId: string,
  data: AccountSettingRepository.IUpdateBasicSettingData,
) => {
  let query = {
    theme: DEFAULT_ACCOUNT_SETTING.theme as Theme,
    language: DEFAULT_ACCOUNT_SETTING.language,
  }

  if (data.theme) {
    query.theme = data.theme as Theme
  }

  if (data.language) {
    query.language = data.language.toLowerCase()
  }

  const setting = await AccountSettingRepository.updateBasicAccountSetting(
    accountId,
    query,
  )

  if (!setting) {
    return new HttpException(StatusCodes.BAD_REQUEST, 'update setting failed')
  }

  return setting
}
