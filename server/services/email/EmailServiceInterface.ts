interface EmailServiceInterface {
  sendPasswordResetLink(email: string, token: string): Promise<void>
}

export default EmailServiceInterface
