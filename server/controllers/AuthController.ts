import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { AuthServiceInterface } from 'server/services/auth'
import TYPES from '../config/types'

@injectable()
class AuthController {
  private readonly authService: AuthServiceInterface

  constructor(@inject(TYPES.AuthService) authService: AuthServiceInterface) {
    this.authService = authService
  }

  public login = async (req: Request, res: Response, next: NextFunction) => {
    let token: string
    try {
      token = await this.authService.loginUser(req.body)
    } catch (err) {
      return next(err)
    }
    res.json(token)
  }

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.registerOfficeBuilding(req.body)
    } catch (err) {
      return next(err)
    }
    res.sendStatus(200)
  }
}

export default AuthController
