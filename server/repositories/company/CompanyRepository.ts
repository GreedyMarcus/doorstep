import Company from '../../models/Company'
import OfficeBuilding from '../../models/OfficeBuilding'
import User from '../../models/User'
import CompanyRepositoryInterface from './CompanyRepositoryInterface'
import { EntityRepository, getRepository, Repository } from 'typeorm'
import { injectable } from 'inversify'

@injectable()
@EntityRepository(Company)
class CompanyRepository extends Repository<Company> implements CompanyRepositoryInterface {
  public findCompaniesByBuildingAdminId(adminId: number): Promise<Company[]> {
    return getRepository(Company)
      .createQueryBuilder('company')
      .leftJoinAndSelect(OfficeBuilding, 'building', 'building.id = company.officeBuilding')
      .leftJoinAndSelect(User, 'user', 'building.admin = user.id')
      .where('user.id = :adminId', { adminId })
      .getMany()
  }
}

export default CompanyRepository
