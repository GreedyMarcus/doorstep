import { Request, Response, NextFunction } from 'express'

export default (req: Request, res: Response, next: NextFunction) => {
  // Detect the language used by the client
  res.locals.clientLanguage = (req.headers['client-language'] as string) || 'en'
  return next()
}
