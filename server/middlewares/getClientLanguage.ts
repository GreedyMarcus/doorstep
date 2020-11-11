import { Request, Response, NextFunction } from 'express'

/**
 * Custom middleware that extracts the client language from the request headers
 * and save it to the locals variables.
 */
export default (req: Request, res: Response, next: NextFunction) => {
  res.locals.clientLanguage = (req.headers['client-language'] as string) || 'en'
  return next()
}
