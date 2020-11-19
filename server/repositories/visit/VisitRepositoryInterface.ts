import Visit from '../../models/Visit'
import User from '../../models/User'
import { GuestUpdateByUserDTO } from '../../data/dtos/VisitDTO'

interface VisitRepositoryInterface {
  /**
   * Returns the visit that has the specified id.
   */
  findVisitById(visitId: number): Promise<Visit>

  /**
   * Returns all finished visits that has the specified company id.
   */
  findVisitsByCompanyId(companyId: number): Promise<Visit[]>

  /**
   * Returns all planned visits that has the specified business host id.
   */
  findPlannedVisitsByHostId(companyId: number): Promise<Visit[]>

  /**
   * Returns all visits that has the specified building id.
   */
  findVisitsByBuildingId(buildingId: number): Promise<Visit[]>

  /**
   * Returns all upcoming visits that has the specified guest user id.
   */
  findVisitsByGuestUserId(userId: number): Promise<Visit[]>

  /**
   * Creates a new visit for the specified company with the specified business host id and guests.
   */
  createVisit(companyId: number, hostId: number, data: Partial<Visit>, guests: Partial<User>[]): Promise<Visit>

  /**
   * Updates the visit guest data that belongs to the specified guest user.
   */
  updateVisitGuest(userId: number, visit: Partial<Visit>, data: GuestUpdateByUserDTO): Promise<void>
}

export default VisitRepositoryInterface
