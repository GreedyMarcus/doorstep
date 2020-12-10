import sendgrid from '@sendgrid/mail'
import path from 'path'
import ejs from 'ejs'
import config from '../../config'
import TYPES from '../../config/types'
import EmailServiceInterface from './EmailServiceInterface'
import { v4 as uuidv4 } from 'uuid'
import { inject, injectable } from 'inversify'
import { UserRepositoryInterface } from '../../repositories/user'
import { VisitNotificationDTO } from '../../data/dtos/VisitDTO'
import { localizedSubjects, localizedVisitPurpose } from '../../utils/email'

/**
 * Service that handles email logic.
 */
@injectable()
class EmailService implements EmailServiceInterface {
  private readonly userRepository: UserRepositoryInterface

  constructor(@inject(TYPES.UserRepository) userRepository: UserRepositoryInterface) {
    sendgrid.setApiKey(config.email.sendgridApiKey)
    this.userRepository = userRepository
  }

  public sendPasswordResetLink = async (email: string, token: string, language: string): Promise<void> => {
    const relativeTemplatePath = `templates/password-reset/password-reset-${language}.ejs`
    const absoluteTemplatePath = path.resolve(__dirname.replace('/build', ''), '../..', relativeTemplatePath)

    const resetPasswordLink = `${config.server.baseUrl}/reset-password/${token}`

    const renderedHtml = await ejs.renderFile(absoluteTemplatePath, { resetPasswordLink }, { async: true })
    const message = {
      from: config.email.noreplyEmail,
      to: email,
      subject: localizedSubjects.passwordReset[language],
      html: renderedHtml
    }

    await sendgrid.send(message)
  }

  public sendVisitNotification = async (emails: string[], visitData: VisitNotificationDTO, language: string): Promise<void> => {
    const relativeTemplatePath = `templates/visit-notification/visit-notification-${language}.ejs`
    const absoluteTemplatePath = path.resolve(__dirname.replace('/build', ''), '../..', relativeTemplatePath)

    const foundUsers = await this.userRepository.findAllUsersByEmails(emails)
    const messages = []

    for (const guestUser of foundUsers) {
      // Generate and save password token for guest user
      const generatedToken = uuidv4()
      guestUser.passwordToken = generatedToken
      await this.userRepository.saveUser(guestUser)

      // Generate data for email
      const templateData = {
        link: `${config.server.baseUrl}/reset-password/${generatedToken}`,
        purpose: localizedVisitPurpose[visitData.purpose][language],
        companyName: visitData.companyName,
        buildingAddress: visitData.buildingAddress,
        hostName: visitData.businessHost.fullName,
        hostEmail: visitData.businessHost.email,
        plannedEntry: new Date(visitData.plannedEntry).toLocaleString(language),
        room: visitData.room
      }

      const renderedHtml = await ejs.renderFile(absoluteTemplatePath, templateData, { async: true })
      const message = {
        from: config.email.noreplyEmail,
        to: guestUser.email,
        subject: localizedSubjects.visitNotification[language],
        html: renderedHtml
      }
      messages.push(message)
    }

    await sendgrid.send(messages)
  }
}

export default EmailService
