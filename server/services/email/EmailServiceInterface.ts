import { VisitNotificationDTO } from '../../data/dtos/VisitDTO'

interface EmailServiceInterface {
  /**
   * Sends forgotten password link to the user via email.
   *
   * @param email - the email address of the user
   * @param token - the token that identifies the user
   * @param language - the language of the email content
   */
  sendPasswordResetLink(email: string, token: string, language: string): Promise<void>

  /**
   * Sends multiple emails about the specified visit to the guests.
   *
   * @param emails - the list of the guest emails
   * @param visitData - the information about the specified visit
   * @param language - the language of the email content
   */
  sendVisitNotification(emails: string[], visitData: VisitNotificationDTO, language: string): Promise<void>
}

export default EmailServiceInterface
