import bcrypt from 'bcryptjs'
import Boom from '@hapi/boom'
import TYPES from '../../config/types'
import CompanyServiceInterface from './CompanyServiceInterface'
import { inject, injectable } from 'inversify'
import { UserRepositoryInterface } from '../../repositories/user'
import { CompanyRepositoryInterface } from '../../repositories/company'
import { CompanyInfoDTO, CompanyRegistrationDTO } from '../../data/dtos/CompanyDTO'

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
    const companiesInfo: CompanyInfoDTO[] = companies.map(({ id, name, registrationNumber, address, admin, createdAt }) => ({
      id,
      name,
      registrationNumber,
      address: `${address.country}, ${address.zipCode}, ${address.city}, ${address.streetAddress}`,
      joiningDate: createdAt,
      adminName: `${admin.firstName} ${admin.lastName}`,
      adminEmail: admin.email,
      adminJoiningDate: admin.createdAt
    }))

    return companiesInfo
  }

  public registerCompany = async (companyData: CompanyRegistrationDTO, buildingAdminId: number): Promise<CompanyInfoDTO> => {
    const buildingAdmin = await this.userRepository.findUserById(buildingAdminId)
    if (!buildingAdmin) {
      throw Boom.badRequest('Building admin does not exist')
    }

    // Hash company admin password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(companyData.admin.password, salt)

    // Save company with company admin
    const { name, registrationNumber, address } = companyData
    const companyAdmin = { ...companyData.admin, password: hashedPassword }

    const createdCompany = await this.companyRepository.createCompany({ name, registrationNumber }, address, companyAdmin, buildingAdminId)
    if (!createdCompany) {
      throw Boom.internal('Could not register company')
    }

    const { id, createdAt, admin } = createdCompany
    const createdCompanyInfo: CompanyInfoDTO = {
      id,
      name,
      registrationNumber,
      address: `${address.country}, ${address.zipCode}, ${address.city}, ${address.streetAddress}`,
      joiningDate: createdAt,
      adminName: `${admin.firstName} ${admin.lastName}`,
      adminEmail: admin.email,
      adminJoiningDate: admin.createdAt
    }

    return createdCompanyInfo
  }
}

export default CompanyService
