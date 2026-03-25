import config from '../../config'
import logger from '../../boot/logger'
import sgMail, { MailDataRequired } from '@sendgrid/mail'

const LOGGER_NAME = 'MAIL_LIBS:'

sgMail.setApiKey(config.MAIL.MAIL_API_KEY)

export type MailDataRequiredDto = MailDataRequired

export const sendMail = async (
  contact: MailDataRequired | MailDataRequired[],
  isMultiple?: boolean,
): Promise<string> => {
  try {
    await sgMail.send(contact, isMultiple)

    return 'send mail success'
  } catch (error) {
    logger.error({ type: LOGGER_NAME, error })

    throw error
  }
}
