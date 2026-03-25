export const covertTextToSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replaceAll(/\s+/g, '-') // space → -
    .replaceAll('_', '-') // underscore → -
    .replaceAll(/[^\w-]+/g, '') // remove special chars
    .replaceAll(/-+/g, '-') // replace multiple hyphens with a single hyphen
}
