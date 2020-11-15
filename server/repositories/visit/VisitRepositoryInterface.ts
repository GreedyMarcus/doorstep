import Visit from '../../models/Visit'
import User from '../../models/User'

interface VisitRepositoryInterface {
  /**
   * Returns all visits that has the specified company id.
   */
  findVisitsByCompanyId(companyId: number): Promise<Visit[]>

  /**
   * Creates a new visit for the specified company with the specified business host id and guests.
   */
  createVisit(companyId: number, hostId: number, data: Partial<Visit>, guests: Partial<User>[]): Promise<Visit>
}

export default VisitRepositoryInterface
