import Visit from '../../models/Visit'

interface VisitRepositoryInterface {
  findVisitsByCompanyId(companyId: number): Promise<Visit[]>
}

export default VisitRepositoryInterface
