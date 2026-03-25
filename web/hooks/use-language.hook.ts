import { setLocale } from '@/utils/locales'
import { usePathname, useRouter } from 'next/navigation'

export type TLanguage = {
  language: TLang
  code: string
  image: {
    normal: string
    square: string
  }
}

export type TLang = 'en' | 'th'

const useLanguageHook = () => {
  const router = useRouter()
  const pathname = usePathname()

  const languages = [
    {
      language: 'English',
      code: 'en',
      image: {
        normal: '/flags/4x3/en.svg',
        square: '/flags/1x1/en.svg',
      },
    },
    {
      language: 'ภาษาไทย',
      code: 'th',
      image: {
        normal: '/flags/4x3/th.svg',
        square: '/flags/1x1/th.svg',
      },
    },
  ]

  const getDatabyCode = (code: string) => {
    return languages.find((lang) => lang.code === code)
  }

  const onChangeLanguage = (language: TLang) => {
    setLocale(language)

    if (pathname === '/en' || pathname === '/th') {
      router.replace('/' + language)
    } else {
      router.refresh()
    }
  }

  return { languages, getDatabyCode, onChangeLanguage }
}

export default useLanguageHook
