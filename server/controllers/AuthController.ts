import TYPES from '../config/types'
import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { UserLoginResultDTO } from '../data/dtos/UserDTO'
import { AuthServiceInterface } from '../services/auth'

@injectable()
class AuthController {
  private readonly authService: AuthServiceInterface

  constructor(@inject(TYPES.AuthService) authService: AuthServiceInterface) {
    this.authService = authService
  }

  public login = async (req: Request, res: Response, next: NextFunction) => {
    let user: UserLoginResultDTO
    try {
      user = await this.authService.loginUser(req.body)
    } catch (err) {
      return next(err)
    }
    res.json(user)
  }

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.registerOfficeBuilding(req.body)
    } catch (err) {
      return next(err)
    }
    res.sendStatus(200)
  }

  public whoami = async (req: Request, res: Response, next: NextFunction) => {
    let user: UserLoginResultDTO
    try {
      user = await this.authService.getCurrentUser(res.locals.userId)
    } catch (err) {
      return next(err)
    }
    res.json(user)
  }

  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.forgotUserPassword(req.body.email)
    } catch (err) {
      return next(err)
    }
    res.sendStatus(200)
  }
}

export default AuthController
