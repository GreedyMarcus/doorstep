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
}

export default CompaniesController
