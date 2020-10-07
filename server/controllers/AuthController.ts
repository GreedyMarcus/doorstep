import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { AuthServiceInterface } from 'server/services/auth'
import TYPES from '../config/types'
import Boom from '@hapi/boom'

@injectable()
class AuthController {
  private readonly authService: AuthServiceInterface

  constructor(@inject(TYPES.AuthService) authService: AuthServiceInterface) {
    this.authService = authService
  }

  public login = async (req: Request, res: Response, next: NextFunction) => {
    res.send('LOGIN')
  }

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    res.send('LOGOUT')
  }

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.registerOfficeBuilding(req.body)
    } catch (err) {
      console.log(err)
      if (Boom.isBoom(err)) {
        return next(err)
      }
      return next(Boom.internal(err.message))
    }
    res.sendStatus(200)
  }
}

export default AuthController
