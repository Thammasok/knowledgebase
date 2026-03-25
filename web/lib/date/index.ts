import 'dayjs/locale/th'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import updateLocale from 'dayjs/plugin/updateLocale'
import relativeTime from 'dayjs/plugin/relativeTime'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { getCookies } from '@/lib/cookie'
import globalConfig from '@/configs/global.config'

dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.extend(isSameOrAfter)
dayjs.locale('th')

const datejs = (date?: string | Date | null) => {
  const locale =
    getCookies(globalConfig.locale.nextLocal) || globalConfig.locale.default
  dayjs.extend(isSameOrAfter)
  if (date) {
    return dayjs(date).locale(locale)
  }

  return dayjs().locale(locale)
}

export default datejs
