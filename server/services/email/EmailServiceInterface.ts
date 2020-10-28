interface EmailServiceInterface {
  sendPasswordResetLink(email: string, token: string, language: string): Promise<void>
}

export default EmailServiceInterface
