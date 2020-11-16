import { VisitDetailsDTO } from '../../data/dtos/VisitDTO'

interface VisitServiceInterface {
  /**
   * Returns the consent form specified by id.
   */
  getVisitById(formId: number): Promise<VisitDetailsDTO>
}

export default VisitServiceInterface
