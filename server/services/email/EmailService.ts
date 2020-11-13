import sendgrid from '@sendgrid/mail'
import path from 'path'
import ejs from 'ejs'
import config from '../../config'
import EmailServiceInterface from './EmailServiceInterface'
import { subjects } from '../../utils/email'
import { injectable } from 'inversify'

@injectable()
class EmailService implements EmailServiceInterface {
  constructor() {
    sendgrid.setApiKey(config.email.sendgridApiKey)
  }

  public sendPasswordResetLink = async (email: string, token: string, language: string): Promise<void> => {
    const relativeTemplatePath = `templates/email/password-reset-${language}.ejs`
    const absoluteTemplatePath = path.resolve(__dirname.replace('/build', ''), '../..', relativeTemplatePath)

    const resetPasswordLink = `${config.server.baseUrl}/reset-password/${token}`

    const renderedHtml = await ejs.renderFile(absoluteTemplatePath, { resetPasswordLink }, { async: true })
    const message = {
      from: config.email.noreplyEmail,
      to: email,
      subject: subjects.passwordReset[language],
      html: renderedHtml
    }

    await sendgrid.send(message)
  }
}

export default EmailService
