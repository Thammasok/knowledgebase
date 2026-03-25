import { MailtrapClient, type Mail } from 'mailtrap'
import mailConfig from '../../config/mail'
import logger from '../../boot/logger'

const LOGGER_NAME = 'MAIL_LIBS:'

export type MailConfig = {
  token: string
  sandbox?: boolean
  testInboxId?: number
}

export const sendMail = (contact: Mail) => {
  try {
    let config: MailConfig = {
      token: mailConfig.MAIL.MAIL_API_KEY,
    }

    // On Development
    if (mailConfig.MAIL.IS_SANDBOX &&  mailConfig.MAIL.TEST_SANDBOX_ID) {
      config.sandbox = mailConfig.MAIL.IS_SANDBOX
      config.testInboxId = mailConfig.MAIL.TEST_SANDBOX_ID
    }

    const client = new MailtrapClient({
      token: mailConfig.MAIL.MAIL_API_KEY,
      sandbox: mailConfig.MAIL.IS_SANDBOX,
      testInboxId: 4458687,
    })

    return client.send(contact)
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    throw error
  }
}
