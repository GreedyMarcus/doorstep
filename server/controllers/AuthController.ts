import { Request, Response, NextFunction } from 'express'

class AuthController {
  constructor() {}

  public async login(req: Request, res: Response, next: NextFunction) {
    res.send('LOGIN')
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    res.send('LOGOUT')
  }

  public async register(req: Request, res: Response, next: NextFunction) {
    res.send('REGISTER')
  }
}

export default AuthController
