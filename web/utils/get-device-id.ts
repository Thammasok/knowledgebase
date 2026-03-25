export const getDeviceId = () => {
  if (typeof window === 'undefined') return ''

  const deviceId = localStorage.getItem('deviceId')

  return deviceId
}
