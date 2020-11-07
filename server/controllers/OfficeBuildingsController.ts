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
}

export default OfficeBuildingsController
