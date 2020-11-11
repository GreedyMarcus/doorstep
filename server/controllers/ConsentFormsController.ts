import TYPES from '../config/types'
import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { ConsentFormServiceInterface } from '../services/consentForm'

@injectable()
class ConsentFormsController {
  private readonly consentFormService: ConsentFormServiceInterface

  constructor(@inject(TYPES.ConsentFormService) consentFormService: ConsentFormServiceInterface) {
    this.consentFormService = consentFormService
  }

  public getConsentFormById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const consentFormId = Number(req.params.consentFormId)
      const consentForm = await this.consentFormService.getConsentFormById(consentFormId)
      res.json(consentForm)
    } catch (err) {
      return next(err)
    }
  }

  public createConsentFormVersion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const consentFormId = Number(req.params.consentFormId)
      const version = await this.consentFormService.createConsentFormVersion(consentFormId, req.body.content)
      res.status(201).json(version)
    } catch (err) {
      return next(err)
    }
  }

  public updateConsentFormVersion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const consentFormId = Number(req.params.consentFormId)
      const versionId = Number(req.params.versionId)
      const version = await this.consentFormService.updateConsentFormVersion(consentFormId, versionId, req.body.content)
      res.json(version)
    } catch (err) {
      return next(err)
    }
  }

  public activateConsentFormVersion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const consentFormId = Number(req.params.consentFormId)
      const versionId = Number(req.params.versionId)
      await this.consentFormService.activateConsentFormVersion(consentFormId, versionId)
      res.sendStatus(204)
    } catch (err) {
      return next(err)
    }
  }
}

export default ConsentFormsController
