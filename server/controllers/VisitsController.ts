import TYPES from '../config/types'
import { Request, Response, NextFunction } from 'express'
import { inject, injectable } from 'inversify'
import { VisitServiceInterface } from '../services/visit'

@injectable()
class VisitsController {
  private readonly visitService: VisitServiceInterface

  constructor(@inject(TYPES.VisitService) visitService: VisitServiceInterface) {
    this.visitService = visitService
  }

  public getVisitById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const visitId = Number(req.params.visitId)
      const visit = await this.visitService.getVisitById(visitId)
      res.json(visit)
    } catch (err) {
      return next(err)
    }
  }

  public getGuestInvitations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId)
      const invitations = await this.visitService.getInvitationsByUserId(userId)
      res.json(invitations)
    } catch (err) {
      return next(err)
    }
  }
}

export default VisitsController
