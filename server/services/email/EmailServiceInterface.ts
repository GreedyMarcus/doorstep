interface EmailServiceInterface {
  /**
   * Sends forgotten password link to the user via email.
   *
   * @param email - the email address of the user
   * @param token - the token that identifies the user
   * @param language - the language of the email content
   */
  sendPasswordResetLink(email: string, token: string, language: string): Promise<void>
}

export default EmailServiceInterface
