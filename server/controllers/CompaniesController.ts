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
}

export default CompaniesController
