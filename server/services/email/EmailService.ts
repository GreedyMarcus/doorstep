import sendgrid from '@sendgrid/mail'
import Boom from '@hapi/boom'
import config from '../../config'
import EmailServiceInterface from './EmailServiceInterface'
import { injectable } from 'inversify'

@injectable()
class EmailService implements EmailServiceInterface {
  constructor() {
    sendgrid.setApiKey(config.email.sendgridApiKey)
  }

  public sendPasswordResetLink = async (email: string, token: string): Promise<void> => {
    const message = {
      from: config.email.noreplyEmail,
      to: email,
      subject: '[RESET-PASSWORD]',
      html: `<strong><a href="${config.server.baseUrl}/reset-password/${token}" target="_blank">Reset link</a></strong>`
    }

    try {
      await sendgrid.send(message)
    } catch (error) {
      throw Boom.internal('Could not send password reset link email')
    }
  }
}

export default EmailService
