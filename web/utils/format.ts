export const convertNationalIdToThaiFormat = (nationalId: string): string => {
  if (!nationalId || nationalId.length !== 13) {
    return nationalId // Return as is if invalid
  }

  return `${nationalId.slice(0, 1)}-${nationalId.slice(1, 5)}-${nationalId.slice(5, 10)}-${nationalId.slice(10, 12)}-${nationalId.slice(12, 13)}`
}

export const convertPhoneNumberToThaiFormat = (phoneNumber: string): string => {
  if (!phoneNumber || phoneNumber.length !== 10) {
    return phoneNumber // Return as is if invalid
  }

  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`
}

export const formatPhone = (phone: string) => {
  const phoneValue = phone.replace(/\D/g, '').slice(0, 12)

  // Format XXX-XXX-XXXX
  if (phoneValue.length <= 3) return phoneValue
  if (phoneValue.length <= 6)
    return `${phoneValue.slice(0, 3)}-${phoneValue.slice(3, 6)}`
  if (phoneValue.length <= 10)
    return `${phoneValue.slice(0, 3)}-${phoneValue.slice(3, 6)}-${phoneValue.slice(6, 10)}`

  return `${phoneValue.slice(0, 3)}-${phoneValue.slice(3, 6)}-${phoneValue.slice(6, 10)}`
}

export const firstUpper = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
