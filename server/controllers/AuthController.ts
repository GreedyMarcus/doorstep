import TYPES from '../config/types'
import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { AuthServiceInterface } from '../services/auth'

@injectable()
class AuthController {
  private readonly authService: AuthServiceInterface

  constructor(@inject(TYPES.AuthService) authService: AuthServiceInterface) {
    this.authService = authService
  }

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.loginUser(req.body)
      res.json(user)
    } catch (err) {
      return next(err)
    }
  }

  public whoami = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.getCurrentUser(res.locals.userId)
      res.json(user)
    } catch (err) {
      return next(err)
    }
  }

  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.forgotUserPassword(req.body.email, res.locals.clientLanguage)
      res.sendStatus(200)
    } catch (err) {
      return next(err)
    }
  }

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.resetUserPassword(req.body.token, req.body.password)
      res.json(user)
    } catch (err) {
      return next(err)
    }
  }
}

export default AuthController
