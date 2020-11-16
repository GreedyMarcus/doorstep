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

  public createVisit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = Number(req.params.companyId)
      const visit = await this.companyService.createVisit(companyId, req.body)
      res.status(201).json(visit)
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

  public createBusinessHost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = Number(req.params.companyId)
      const businessHost = await this.companyService.createBusinessHost(companyId, req.body)
      res.status(201).json(businessHost)
    } catch (err) {
      return next(err)
    }
  }

  public updateBusinessHost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = Number(req.params.companyId)
      const businessHostId = Number(req.params.businessHostId)
      const updatedBusinessHost = await this.companyService.updateBusinessHost(companyId, businessHostId, req.body)
      res.json(updatedBusinessHost)
    } catch (err) {
      return next(err)
    }
  }

  public getPlannedVisits = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = Number(req.params.companyId)
      const businessHostId = Number(req.params.businessHostId)
      const plannedVisits = await this.companyService.getPlannedVisits(companyId, businessHostId)
      res.json(plannedVisits)
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

  public createConsentForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = Number(req.params.companyId)
      const consentForm = await this.companyService.createConsentForm(companyId, req.body)
      res.status(201).json(consentForm)
    } catch (err) {
      return next(err)
    }
  }

  public getCompanyConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = Number(req.params.companyId)
      const config = await this.companyService.getCompanyConfig(companyId)
      res.json(config)
    } catch (err) {
      return next(err)
    }
  }

  public updateCompanyConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = Number(req.params.companyId)
      await this.companyService.updateCompanyConfig(companyId, req.body)
      res.sendStatus(204)
    } catch (err) {
      return next(err)
    }
  }

  public getAvailableGuestUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = Number(req.params.companyId)
      const guestUsers = await this.companyService.getAvailableGuestUsers(companyId)
      res.json(guestUsers)
    } catch (err) {
      return next(err)
    }
  }
}

export default CompaniesController
