import Visit from '../../models/Visit'

interface VisitRepositoryInterface {
  /**
   * Returns all visits that has the specified company id.
   */
  findVisitsByCompanyId(companyId: number): Promise<Visit[]>
}

export default VisitRepositoryInterface
