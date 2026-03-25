import { describe, expect, it } from '@jest/globals'
import { calculateSkip } from '../db-utils'

describe('calculateSkip', () => {
  it('should return 0 when page is 1', () => {
    expect(calculateSkip(1, 10)).toBe(0)
  })

  it('should return the correct skip value for page 2', () => {
    expect(calculateSkip(2, 10)).toBe(10)
  })

  it('should return the correct skip value for page 3', () => {
    expect(calculateSkip(3, 10)).toBe(20)
  })

  it('should return the correct skip value for page 4', () => {
    expect(calculateSkip(4, 10)).toBe(30)
  })

  // Add more test cases as needed
})
