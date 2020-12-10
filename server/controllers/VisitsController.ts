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

  public getVisitGuestById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const visitId = Number(req.params.visitId)
      const guestId = Number(req.params.guestId)
      const visitGuest = await this.visitService.getVisitGuestById(visitId, guestId)
      res.json(visitGuest)
    } catch (err) {
      return next(err)
    }
  }

  public getGuestInvitations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId)
      const invitations = await this.visitService.getGuestInvitations(userId)
      res.json(invitations)
    } catch (err) {
      return next(err)
    }
  }

  public getGuestInvitationProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId)
      const visitId = Number(req.params.visitId)
      const invitationProfile = await this.visitService.getGuestInvitationProfile(userId, visitId)
      res.json(invitationProfile)
    } catch (err) {
      return next(err)
    }
  }

  public updateGuestInvitationProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId)
      const visitId = Number(req.params.visitId)
      await this.visitService.updateGuestInvitationProfile(userId, visitId, req.body)
      res.sendStatus(204)
    } catch (err) {
      return next(err)
    }
  }

  public updateGuestByReceptionist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const visitId = Number(req.params.visitId)
      const guestId = Number(req.params.guestId)
      await this.visitService.updateGuestByReceptionist(visitId, guestId, req.body)
      res.sendStatus(204)
    } catch (err) {
      return next(err)
    }
  }

  public trackGuestExitTime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const visitId = Number(req.params.visitId)
      const guestId = Number(req.params.guestId)
      await this.visitService.trackGuestExitTime(visitId, guestId)
      res.sendStatus(204)
    } catch (err) {
      return next(err)
    }
  }
}

export default VisitsController
