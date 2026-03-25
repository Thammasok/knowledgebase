let timeoutId: NodeJS.Timeout | undefined = undefined

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const setDebounce = (func: Function, wait: number) => {
  clearTimeout(timeoutId)

  return timeoutId = setTimeout(() => func(), wait)
}
