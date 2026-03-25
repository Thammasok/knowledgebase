import { MailtrapClient, type Mail } from 'mailtrap'
import { sendMail } from './mailtrap'
import logger from '../../boot/logger'

jest.mock('mailtrap')

jest.mock('../../config/mail', () => ({
  __esModule: true,
  default: {
    MAIL: {
      MAIL_API_KEY: 'test-api-key',
      IS_SANDBOX: false,
      TEST_SANDBOX_ID: null,
    },
  },
}))

jest.mock('../../boot/logger', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}))

const mockSend = jest.fn()

;(MailtrapClient as jest.Mock).mockImplementation(() => ({
  send: mockSend,
}))

const mockContact: Mail = {
  to: [{ email: 'recipient@example.com' }],
  from: { email: 'sender@example.com' },
  subject: 'Test Subject',
  text: 'Test body',
}

describe('MAIL_LIBS: mailtrap', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(MailtrapClient as jest.Mock).mockImplementation(() => ({
      send: mockSend,
    }))
  })

  describe('sendMail', () => {
    it('should create MailtrapClient with correct config and send mail', async () => {
      const mockResponse = { messageIds: ['abc123'] }
      mockSend.mockResolvedValue(mockResponse)

      const result = await sendMail(mockContact)

      expect(MailtrapClient).toHaveBeenCalledWith({
        token: 'test-api-key',
        sandbox: false,
        testInboxId: 4458687,
      })
      expect(mockSend).toHaveBeenCalledWith(mockContact)
      expect(result).toBe(mockResponse)
    })

    it('should create MailtrapClient with sandbox config when IS_SANDBOX is true', async () => {
      const mailConfig = require('../../config/mail').default
      mailConfig.MAIL.IS_SANDBOX = true
      mailConfig.MAIL.TEST_SANDBOX_ID = 9999

      const mockResponse = { messageIds: ['sandbox123'] }
      mockSend.mockResolvedValue(mockResponse)

      const result = await sendMail(mockContact)

      expect(MailtrapClient).toHaveBeenCalledWith({
        token: 'test-api-key',
        sandbox: true,
        testInboxId: 4458687,
      })
      expect(mockSend).toHaveBeenCalledWith(mockContact)
      expect(result).toBe(mockResponse)

      // restore
      mailConfig.MAIL.IS_SANDBOX = false
      mailConfig.MAIL.TEST_SANDBOX_ID = null
    })

    it('should propagate rejection from client.send without logging (not awaited)', async () => {
      // client.send() is returned but not awaited — its rejection bypasses the
      // try/catch, so logger.error is never called
      const mockError = new Error('Mailtrap send failed')
      mockSend.mockRejectedValue(mockError)

      await expect(sendMail(mockContact)).rejects.toThrow(mockError)
      expect(logger.error).not.toHaveBeenCalled()
    })

    it('should log error and rethrow when MailtrapClient constructor throws synchronously', () => {
      // Constructor throws synchronously — caught by try/catch, logged, rethrown
      const mockError = new Error('Invalid API key')
      ;(MailtrapClient as jest.Mock).mockImplementation(() => {
        throw mockError
      })

      expect(() => sendMail(mockContact)).toThrow(mockError)
      expect(logger.error).toHaveBeenCalledWith({
        type: 'MAIL_LIBS:',
        error: mockError,
      })
    })
  })
})
