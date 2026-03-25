export const getShortName = (name: string) => {
  if (!name) return ''

  const names = name.split(' ')
  if (names.length > 1) {
    return `${names[0].substring(0, 1).toUpperCase()}${names[1].substring(0, 1).toUpperCase()}`
  }
  return name.substring(0, 2).toUpperCase()
}
