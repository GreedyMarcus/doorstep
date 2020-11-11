import TYPES from '../config/types'
import { inject, injectable } from 'inversify'
import { Request, Response, NextFunction } from 'express'
import { CompanyServiceInterface } from '../services/company'

@injectable()
class CompaniesController {
  private readonly companyService: CompanyServiceInterface

  constructor(@inject(TYPES.CompanyService) companyService: CompanyServiceInterface) {
    this.companyService = companyService
  }

  public updateCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = Number(req.params.companyId)
      const updatedCompany = await this.companyService.updateCompany(companyId, req.body)
      res.json(updatedCompany)
    } catch (err) {
      return next(err)
    }
  }

  public getVisits = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = Number(req.params.companyId)
      const visits = await this.companyService.getVisits(companyId)
      res.json(visits)
    } catch (err) {
      return next(err)
    }
  }

  public getBusinessHosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = Number(req.params.companyId)
      const businessHosts = await this.companyService.getBusinessHosts(companyId)
      res.json(businessHosts)
    } catch (err) {
      return next(err)
    }
  }

  public getConsentForms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = Number(req.params.companyId)
      const consentForms = await this.companyService.getConsentForms(companyId)
      res.json(consentForms)
    } catch (err) {
      return next(err)
    }
  }
}

export default CompaniesController
