import Visit from '../../models/Visit'
import VisitRepositoryInterface from './VisitRepositoryInterface'
import { injectable } from 'inversify'
import { EntityRepository, getRepository, Repository } from 'typeorm'

@injectable()
@EntityRepository(Visit)
class VisitRepository extends Repository<Visit> implements VisitRepositoryInterface {
  public findVisitsByCompanyId(companyId: number): Promise<Visit[]> {
    return getRepository(Visit)
      .createQueryBuilder('visit')
      .leftJoinAndSelect('visit.businessHost', 'businessHost')
      .where('visit.company = :companyId', { companyId })
      .getMany()
  }
}

export default VisitRepository
