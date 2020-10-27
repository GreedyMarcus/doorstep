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

  public sendTestEmail = async (): Promise<void> => {
    const testMessage = {
      from: config.email.testEmailFrom,
      to: config.email.testEmailTo,
      subject: '[TEST]',
      text: 'Email service tester email.',
      html: '<strong>Email service tester email.</strong>'
    }

    sendgrid
      .send(testMessage)
      .then(() => console.log('Test email sent.'))
      .catch(error => {
        throw Boom.internal(error.message)
      })
  }
}

export default EmailService
