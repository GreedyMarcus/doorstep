import ConsentForm from '../../models/ConsentForm'
import OfficeBuilding from '../../models/OfficeBuilding'
import User from '../../models/User'
import ConsentFormRepositoryInterface from './ConsentFormRepositoryInterface'
import { EntityRepository, getRepository, Repository } from 'typeorm'
import { injectable } from 'inversify'

@injectable()
@EntityRepository(ConsentForm)
class ConsentFormRepository extends Repository<ConsentForm> implements ConsentFormRepositoryInterface {
  public findConsentFormsByBuildingAdminId(adminId: number): Promise<ConsentForm[]> {
    return getRepository(ConsentForm)
      .createQueryBuilder('consentForm')
      .leftJoinAndSelect(OfficeBuilding, 'building', 'building.id = consentForm.officeBuilding')
      .leftJoinAndSelect(User, 'user', 'building.admin = user.id')
      .where('user.id = :adminId', { adminId })
      .getMany()
  }
}

export default ConsentFormRepository
