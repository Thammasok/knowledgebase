export const calculatePage = (page: number, size: number) => {
  return Math.ceil((page || 0) / size)
}
