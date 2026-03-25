import Cookies from 'js-cookie'

export const setCookies = (
  name: string,
  value: string,
  options?: Record<string, unknown>,
) => {
  return Cookies.set(name, value, options)
}

export const getCookies = (name: string) => {
  return Cookies.get(name) || ''
}

export const removeCookies = (name: string) => {
  return Cookies.remove(name)
}
