import Visit from '../../models/Visit'
import User from '../../models/User'

interface VisitRepositoryInterface {
  /**
   * Returns all finished visits that has the specified company id.
   */
  findVisitsByCompanyId(companyId: number): Promise<Visit[]>

  /**
   * Returns all planned visits that has the specified business host id.
   */
  findPlannedVisitsByHostId(companyId: number): Promise<Visit[]>

  /**
   * Creates a new visit for the specified company with the specified business host id and guests.
   */
  createVisit(companyId: number, hostId: number, data: Partial<Visit>, guests: Partial<User>[]): Promise<Visit>
}

export default VisitRepositoryInterface
