import { covertTextToSlug } from '../slug'

describe('covertTextToSlug', () => {
  it('should convert text to slug format', () => {
    expect(covertTextToSlug('This is a test')).toBe('this-is-a-test')
    expect(covertTextToSlug('This-is-a-test')).toBe('this-is-a-test')
  })

  it('should handle underscores', () => {
    expect(covertTextToSlug('This_is_a_test')).toBe('this-is-a-test')
  })

  it('should handle special characters', () => {
    expect(covertTextToSlug('This-is-a-test-with-special-chars!')).toBe(
      'this-is-a-test-with-special-chars',
    )

    expect(
      covertTextToSlug('This-is-a-test-with-special-chars!@#$%^&*()'),
    ).toBe('this-is-a-test-with-special-chars')
  })

  it('should trim leading and trailing spaces', () => {
    expect(covertTextToSlug('  This is a test   ')).toBe('this-is-a-test')
  })

  it('should handle empty input', () => {
    expect(covertTextToSlug('')).toBe('')
  })
})
