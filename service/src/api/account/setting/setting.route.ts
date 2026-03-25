import { RoutersTypes } from '../../../types/routes'
import { getAccountSetting, updateBasicSetting } from './setting.controller'
import { basicSettingSchema } from './setting.validate'

const settingRouters: RoutersTypes[] = [
  {
    route: '/setting/basic',
    method: 'get',
    auth: true,
    handler: getAccountSetting,
  },
  {
    route: '/setting/basic',
    method: 'patch',
    auth: true,
    validate: {
      type: 'body',
      schema: basicSettingSchema,
    },
    handler: updateBasicSetting,
  },
]

export default settingRouters
