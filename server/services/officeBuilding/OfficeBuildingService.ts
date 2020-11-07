import bcrypt from 'bcryptjs'
import Boom from '@hapi/boom'
import TYPES from '../../config/types'
import OfficeBuildingServiceInterface from './OfficeBuildingServiceInterface'
import { inject, injectable } from 'inversify'
import { UserRepositoryInterface } from '../../repositories/user'
import { OfficeBuildingRepositoryInterface } from '../../repositories/officeBuilding'
import { CompanyRepositoryInterface } from '../../repositories/company'
import { OfficeBuildingRegisterDTO } from '../../data/dtos/OfficeBuildingDTO'
import { CompanyInfoDTO, CompanyRegisterDTO } from '../../data/dtos/CompanyDTO'

@injectable()
class OfficeBuildingService implements OfficeBuildingServiceInterface {
  private readonly userRepository: UserRepositoryInterface
  private readonly officeBuildingRepository: OfficeBuildingRepositoryInterface
  private readonly companyRepository: CompanyRepositoryInterface

  constructor(
    @inject(TYPES.UserRepository) userRepository: UserRepositoryInterface,
    @inject(TYPES.OfficeBuildingRepository) officeBuildingRepository: OfficeBuildingRepositoryInterface,
    @inject(TYPES.CompanyRepository) companyRepository: CompanyRepositoryInterface
  ) {
    this.userRepository = userRepository
    this.officeBuildingRepository = officeBuildingRepository
    this.companyRepository = companyRepository
  }

  public registerBuilding = async ({ admin, address }: OfficeBuildingRegisterDTO): Promise<void> => {
    const buildingAdmin = await this.userRepository.findUserByEmail(admin.email)
    if (buildingAdmin) {
      throw Boom.badRequest('Admin already exists')
    }

    const buildingWithAddress = await this.officeBuildingRepository.findBuildingByAddress(address)
    if (buildingWithAddress) {
      throw Boom.badRequest('Office building already exists with address')
    }

    // Hash password for building admin
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(buildingAdmin.password, salt)

    // Save office building
    const adminData = { ...admin, password: hashedPassword }

    const createdBuilding = await this.officeBuildingRepository.createBuilding(adminData, address)
    if (!createdBuilding) {
      throw Boom.internal('Could not register office building')
    }
  }

  public getCompanies = async (buildingId: number): Promise<CompanyInfoDTO[]> => {
    const building = await this.officeBuildingRepository.findBuildingById(buildingId)
    if (!building) {
      throw Boom.badRequest('Building does not exists')
    }

    const companies = await this.companyRepository.findCompaniesByBuildingId(buildingId)
    const companiesInfo: CompanyInfoDTO[] = companies.map(({ id, name, registrationNumber, address, createdAt, admin }) => ({
      id,
      name,
      registrationNumber,
      address: `${address.country}, ${address.zipCode}, ${address.city}, ${address.streetAddress}`,
      createdAt,
      adminName: `${admin.firstName} ${admin.lastName}`,
      adminEmail: admin.email,
      adminJoinedAt: admin.createdAt
    }))

    return companiesInfo
  }

  public registerCompany = async (buildingId: number, data: CompanyRegisterDTO): Promise<CompanyInfoDTO> => {
    const building = await this.officeBuildingRepository.findBuildingById(buildingId)
    if (!building) {
      throw Boom.badRequest('Building does not exists')
    }

    const { name, registrationNumber, address } = data

    // Hash company admin password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.admin.password, salt)

    // Save company with admin
    const adminData = { ...data.admin, password: hashedPassword }
    const companyData = { name, registrationNumber }

    const createdCompany = await this.companyRepository.createCompany(buildingId, companyData, address, adminData)
    if (!createdCompany) {
      throw Boom.internal('Could not register company')
    }

    const { id, createdAt, admin } = createdCompany
    const createdCompanyInfo: CompanyInfoDTO = {
      id,
      name,
      registrationNumber,
      address: `${address.country}, ${address.zipCode}, ${address.city}, ${address.streetAddress}`,
      createdAt,
      adminName: `${admin.firstName} ${admin.lastName}`,
      adminEmail: admin.email,
      adminJoinedAt: admin.createdAt
    }

    return createdCompanyInfo
  }
}

export default OfficeBuildingService
