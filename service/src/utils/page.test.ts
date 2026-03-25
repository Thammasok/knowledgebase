import { describe, expect, it } from '@jest/globals'
import { calculatePage } from './page'

describe('calculatePage', () => {
  it('should return the correct page number 1', () => {
    expect(calculatePage(1, 10)).toBe(1)
  })

  it('should return the correct page number 1', () => {
    expect(calculatePage(10, 10)).toBe(1)
  })

  it('should return the correct page number 2', () => {
    expect(calculatePage(11, 10)).toBe(2)
  })

  it('should return the correct page number 2', () => {
    expect(calculatePage(20, 10)).toBe(2)
  })

  it('should return the correct page number 0', () => {
    expect(calculatePage(0, 10)).toBe(0)
  })
})
