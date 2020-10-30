import TYPES from '../config/types'
import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { ConsentFormInfoDTO } from '../data/dtos/ConsentFormDTO'
import { ConsentFormServiceInterface } from '../services/consentForm'

@injectable()
class ConsentFormsController {
  private readonly consentFormService: ConsentFormServiceInterface

  constructor(@inject(TYPES.ConsentFormService) consentFormService: ConsentFormServiceInterface) {
    this.consentFormService = consentFormService
  }

  public getGlobalConsentForms = async (req: Request, res: Response, next: NextFunction) => {
    let globalConsentForms: ConsentFormInfoDTO[]
    try {
      globalConsentForms = await this.consentFormService.getConsentFormsByBuildingAdminId(res.locals.userId)
    } catch (err) {
      return next(err)
    }
    res.json(globalConsentForms)
  }
}

export default ConsentFormsController
