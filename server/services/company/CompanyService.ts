import Boom from '@hapi/boom'
import TYPES from '../../config/types'
import CompanyServiceInterface from './CompanyServiceInterface'
import { inject, injectable } from 'inversify'
import { UserRepositoryInterface } from '../../repositories/user'
import { CompanyRepositoryInterface } from '../../repositories/company'
import { CompanyInfoDTO } from '../../data/dtos/CompanyDTO'

@injectable()
class CompanyService implements CompanyServiceInterface {
  private readonly userRepository: UserRepositoryInterface
  private readonly companyRepository: CompanyRepositoryInterface

  constructor(
    @inject(TYPES.UserRepository) userRepository: UserRepositoryInterface,
    @inject(TYPES.CompanyRepository) companyRepository: CompanyRepositoryInterface
  ) {
    this.userRepository = userRepository
    this.companyRepository = companyRepository
  }

  public getCompaniesByBuildingAdminId = async (adminId: number): Promise<CompanyInfoDTO[]> => {
    const buildingAdmin = await this.userRepository.findUserById(adminId)
    if (!buildingAdmin) {
      throw Boom.badRequest('Building admin does not exist')
    }

    const companies = await this.companyRepository.findCompaniesByBuildingAdminId(adminId)
    const companiesInfo: CompanyInfoDTO[] = companies.map(({ id, name, registrationNumber, address, createdAt }) => ({
      id,
      name,
      registrationNumber,
      address: `${address.country}, ${address.zipCode}, ${address.city}, ${address.streetAddress}`,
      joiningDate: createdAt,
      adminName: `${buildingAdmin.firstName} ${buildingAdmin.lastName}`,
      adminEmail: buildingAdmin.email,
      adminJoiningDate: buildingAdmin.createdAt
    }))

    return companiesInfo
  }
}

export default CompanyService
