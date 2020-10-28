import sendgrid from '@sendgrid/mail'
import path from 'path'
import ejs from 'ejs'
import Boom from '@hapi/boom'
import config from '../../config'
import EmailServiceInterface from './EmailServiceInterface'
import emailSubjects from '../../utils/emailSubjects'
import { injectable } from 'inversify'

@injectable()
class EmailService implements EmailServiceInterface {
  constructor() {
    sendgrid.setApiKey(config.email.sendgridApiKey)
  }

  public sendPasswordResetLink = async (email: string, token: string, language: string): Promise<void> => {
    const emailTemplatePath = path.resolve(__dirname, '../..', `templates/email/password-reset-${language}.ejs`)
    const resetPasswordLink = `${config.server.baseUrl}/reset-password/${token}`

    try {
      const renderedHtml = await ejs.renderFile(emailTemplatePath, { resetPasswordLink }, { async: true })

      const message = {
        from: config.email.noreplyEmail,
        to: email,
        subject: emailSubjects.passwordReset[language],
        html: renderedHtml
      }
      await sendgrid.send(message)
    } catch (err) {
      throw Boom.internal('Could not send password reset email')
    }
  }
}

export default EmailService
