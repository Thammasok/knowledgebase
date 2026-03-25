import { v7 as uuidv7 } from 'uuid'

export const generateUniqueKey = (): string => {
  return uuidv7()
}
