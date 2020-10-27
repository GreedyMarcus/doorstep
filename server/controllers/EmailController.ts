import TYPES from '../config/types'
import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { EmailServiceInterface } from '../services/email'

@injectable()
class EmailController {
  private readonly emailService: EmailServiceInterface

  constructor(@inject(TYPES.EmailService) emailService: EmailServiceInterface) {
    this.emailService = emailService
  }

  public test = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.emailService.sendTestEmail()
    } catch (err) {
      return next(err)
    }
    res.sendStatus(200)
  }
}

export default EmailController
