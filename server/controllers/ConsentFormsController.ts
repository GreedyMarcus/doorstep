import TYPES from '../config/types'
import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { ConsentFormType } from '../data/enums/ConsentFormType'
import { ConsentFormServiceInterface } from '../services/consentForm'
import { ConsentFormInfoDTO, ConsentFormDetailsDTO, ConsentFormVersionInfoDTO } from '../data/dtos/ConsentFormDTO'

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

  public getGlobalConsentFormById = async (req: Request, res: Response, next: NextFunction) => {
    let globalConsentForm: ConsentFormDetailsDTO
    try {
      globalConsentForm = await this.consentFormService.getConsentFormById(Number(req.params.consentFormId), ConsentFormType.GLOBAL)
    } catch (err) {
      return next(err)
    }
    res.json(globalConsentForm)
  }

  public createGlobalConsentForm = async (req: Request, res: Response, next: NextFunction) => {
    let createdConsentForm: ConsentFormInfoDTO
    try {
      createdConsentForm = await this.consentFormService.createGlobalConsentForm(req.body, res.locals.userId)
    } catch (err) {
      return next(err)
    }
    res.status(201).json(createdConsentForm)
  }

  public createGlobalConsentFormVersion = async (req: Request, res: Response, next: NextFunction) => {
    let createdVersion: ConsentFormVersionInfoDTO
    try {
      createdVersion = await this.consentFormService.createGlobalConsentFormVersion(Number(req.params.consentFormId), req.body.content)
    } catch (err) {
      return next(err)
    }
    res.status(201).json(createdVersion)
  }
}

export default ConsentFormsController
