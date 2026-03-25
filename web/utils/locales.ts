'use server'

import { toast } from 'sonner'
import { cookies } from 'next/headers'
import { TLang } from '@/hooks/use-language.hook'
import globalConfig from '@/configs/global.config'

export async function getLocale(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get(globalConfig.locale.nextLocal)?.value || 'th'
}

export async function setLocale(locale: TLang): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    cookieStore.set(globalConfig.locale.nextLocal, locale)
    return true
  } catch (error) {
    if (error instanceof Error) {
      toast(error.message || 'Something went wrong')
    }
    return false
  }
}
