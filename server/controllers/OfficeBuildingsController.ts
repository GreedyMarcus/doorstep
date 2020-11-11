import TYPES from '../config/types'
import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { OfficeBuildingServiceInterface } from '../services/officeBuilding'

@injectable()
class OfficeBuildingsController {
  private readonly officeBuildingService: OfficeBuildingServiceInterface

  constructor(@inject(TYPES.OfficeBuildingService) officeBuildingService: OfficeBuildingServiceInterface) {
    this.officeBuildingService = officeBuildingService
  }

  public registerOfficeBuilding = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.officeBuildingService.registerBuilding(req.body)
      res.sendStatus(201)
    } catch (err) {
      return next(err)
    }
  }

  public getCompanies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const buildingId = Number(req.params.buildingId)
      const companies = await this.officeBuildingService.getCompanies(buildingId)
      res.json(companies)
    } catch (err) {
      return next(err)
    }
  }

  public registerCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const buildingId = Number(req.params.buildingId)
      const company = await this.officeBuildingService.registerCompany(buildingId, req.body)
      res.status(201).json(company)
    } catch (err) {
      return next(err)
    }
  }

  public getConsentForms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const buildingId = Number(req.params.buildingId)
      const consentForms = await this.officeBuildingService.getConsentForms(buildingId)
      res.json(consentForms)
    } catch (err) {
      return next(err)
    }
  }

  public createConsentForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const buildingId = Number(req.params.buildingId)
      const consentForm = await this.officeBuildingService.createConsentForm(buildingId, req.body)
      res.status(201).json(consentForm)
    } catch (err) {
      return next(err)
    }
  }
}

export default OfficeBuildingsController
