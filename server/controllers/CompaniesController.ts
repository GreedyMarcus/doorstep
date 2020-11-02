import TYPES from '../config/types'
import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { CompanyInfoDTO } from '../data/dtos/CompanyDTO'
import { CompanyServiceInterface } from '../services/company'

@injectable()
class CompaniesController {
  private readonly companyService: CompanyServiceInterface

  constructor(@inject(TYPES.CompanyService) companyService: CompanyServiceInterface) {
    this.companyService = companyService
  }

  public getCompanies = async (req: Request, res: Response, next: NextFunction) => {
    let companies: CompanyInfoDTO[]
    try {
      companies = await this.companyService.getCompaniesByBuildingAdminId(res.locals.userId)
    } catch (err) {
      return next(err)
    }
    res.json(companies)
  }

  public registerCompany = async (req: Request, res: Response, next: NextFunction) => {
    let registeredCompany: CompanyInfoDTO
    try {
      registeredCompany = await this.companyService.registerCompany(req.body, res.locals.userId)
    } catch (err) {
      return next(err)
    }
    res.status(201).json(registeredCompany)
  }

  public updateCompany = async (req: Request, res: Response, next: NextFunction) => {
    let updatedCompany: CompanyInfoDTO
    try {
      updatedCompany = await this.companyService.updateCompany(req.body)
    } catch (err) {
      return next(err)
    }
    res.json(updatedCompany)
  }
}

export default CompaniesController
