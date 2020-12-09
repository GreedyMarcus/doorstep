import Address from '../../models/Address'
import Company from '../../models/Company'
import User from '../../models/User'
import UserRole from '../../models/UserRole'
import OfficeBuilding from '../../models/OfficeBuilding'
import CompanyRegisterConfig from '../../models/CompanyRegisterConfig'
import CompanyRepositoryInterface from './CompanyRepositoryInterface'
import { injectable } from 'inversify'
import { EntityRepository, getManager, getRepository, Repository } from 'typeorm'
import { UserRoleType } from '../../data/enums/UserRoleType'

/**
 * Repository that handles company data manipulation.
 */
@injectable()
@EntityRepository(Company)
class CompanyRepository extends Repository<Company> implements CompanyRepositoryInterface {
  public findCompanyById(companyId: number): Promise<Company> {
    return getRepository(Company)
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.address', 'address')
      .leftJoinAndSelect('company.officeBuilding', 'officeBuilding')
      .leftJoinAndSelect('company.registerConfig', 'registerConfig')
      .leftJoinAndSelect('company.admin', 'admin')
      .leftJoinAndSelect('company.employees', 'employees')
      .leftJoinAndSelect('officeBuilding.admin', 'buildingAdmin')
      .leftJoinAndSelect('officeBuilding.address', 'buildingAddress')
      .where('company.id = :companyId', { companyId })
      .cache(5000) // Cache for 5 seconds
      .getOne()
  }

  public findCompaniesByBuildingId(buildingId: number): Promise<Company[]> {
    return getRepository(Company)
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.officeBuilding', 'officeBuilding')
      .leftJoinAndSelect('company.address', 'address')
      .leftJoinAndSelect('company.admin', 'admin')
      .where('officeBuilding.id = :buildingId', { buildingId })
      .getMany()
  }

  public findCompanyEmployees(companyId: number, role?: UserRoleType): Promise<User[]> {
    const query = getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.company = :companyId', { companyId })

    if (role) {
      query.andWhere('role.name = :roleName', { roleName: role })
    }

    return query.getMany()
  }

  public findCompanyGuestUsers(companyId: number): Promise<User[]> {
    return getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.company', 'company')
      .leftJoinAndSelect('user.role', 'role')
      .where('company.id = :companyId', { companyId })
      .where('role.name = :roleName', { roleName: UserRoleType.GUEST })
      .getMany()
  }

  public async createCompany(
    buildingId: number,
    company: Partial<Company>,
    address: Partial<Address>,
    admin: Partial<User>
  ): Promise<Company> {
    // Check if address already exists
    let companyAddress = await getRepository(Address)
      .createQueryBuilder('address')
      .where('address.country = :country', { country: address.country })
      .andWhere('address.zipCode = :zipCode', { zipCode: address.zipCode })
      .andWhere('address.city = :city', { city: address.city })
      .andWhere('address.streetAddress = :streetAddress', { streetAddress: address.streetAddress })
      .getOne()

    const companyAdminRole = await getRepository(UserRole)
      .createQueryBuilder('role')
      .where('role.name = :roleName', { roleName: UserRoleType.COMPANY_ADMIN })
      .getOne()

    // Force rollback if role does not exist
    if (!companyAdminRole) throw Error

    const companyBuilding = await getRepository(OfficeBuilding)
      .createQueryBuilder('building')
      .where('building.id = :buildingId', { buildingId })
      .getOne()

    // Force rollback if building does not exist
    if (!companyBuilding) throw Error

    return getManager().transaction(async transactionEntityManager => {
      // If address not exists create one for the building
      if (!companyAddress) {
        const newAddress = new Address()
        newAddress.country = address.country
        newAddress.zipCode = address.zipCode
        newAddress.city = address.city
        newAddress.streetAddress = address.streetAddress

        companyAddress = await transactionEntityManager.getRepository(Address).save(newAddress)
      }

      const newCompanyAdminUser = new User()
      newCompanyAdminUser.email = admin.email
      newCompanyAdminUser.password = admin.password
      newCompanyAdminUser.firstName = admin.firstName
      newCompanyAdminUser.lastName = admin.lastName
      newCompanyAdminUser.role = companyAdminRole

      const companyAdmin = await transactionEntityManager.getRepository(User).save(newCompanyAdminUser)

      const newCompanyRegisterConfig = new CompanyRegisterConfig()
      const registerConfig = await transactionEntityManager.getRepository(CompanyRegisterConfig).save(newCompanyRegisterConfig)

      const newCompany = new Company()
      newCompany.name = company.name
      newCompany.registrationNumber = company.registrationNumber
      newCompany.address = companyAddress
      newCompany.admin = companyAdmin
      newCompany.registerConfig = registerConfig
      newCompany.officeBuilding = companyBuilding

      const createdCompany = await transactionEntityManager.getRepository(Company).save(newCompany)

      companyAdmin.company = createdCompany
      await transactionEntityManager.getRepository(User).save(companyAdmin)

      return createdCompany
    })
  }

  public async updateCompany(company: Partial<Company>, address: Partial<Address>, admin?: Partial<User>): Promise<Company> {
    const companyToUpdate = await this.findCompanyById(company.id)

    // Check if address already exists
    let companyAddress = await getRepository(Address)
      .createQueryBuilder('address')
      .where('address.country = :country', { country: address.country })
      .andWhere('address.zipCode = :zipCode', { zipCode: address.zipCode })
      .andWhere('address.city = :city', { city: address.city })
      .andWhere('address.streetAddress = :streetAddress', { streetAddress: address.streetAddress })
      .getOne()

    // If company admin changed get role data
    let companyAdminRole: UserRole
    if (admin) {
      companyAdminRole = await getRepository(UserRole)
        .createQueryBuilder('role')
        .where('role.name = :roleName', { roleName: UserRoleType.ADMIN })
        .getOne()

      // Force rollback if role does not exist
      if (!companyAdminRole) throw Error
    }

    return getManager().transaction(async transactionEntityManager => {
      // If address not exists create one for the company
      if (!companyAddress) {
        const newAddress = new Address()
        newAddress.country = address.country
        newAddress.zipCode = address.zipCode
        newAddress.city = address.city
        newAddress.streetAddress = address.streetAddress

        companyAddress = await transactionEntityManager.getRepository(Address).save(newAddress)
      }

      // If company admin changed, then delete the old one and save the new one
      let companyAdmin: User
      if (admin) {
        // Delete old company amdin
        await transactionEntityManager.getRepository(User).softDelete(companyToUpdate.admin.id)

        const newCompanyAdminUser = new User()
        newCompanyAdminUser.email = admin.email
        newCompanyAdminUser.password = admin.password
        newCompanyAdminUser.firstName = admin.firstName
        newCompanyAdminUser.lastName = admin.lastName
        newCompanyAdminUser.role = companyAdminRole
        companyAdmin = await transactionEntityManager.getRepository(User).save(newCompanyAdminUser)
      }

      companyToUpdate.name = company.name
      companyToUpdate.registrationNumber = company.registrationNumber
      companyToUpdate.address = companyAddress

      if (companyAdmin) {
        companyToUpdate.admin = companyAdmin
      }

      const updatedCompany = await transactionEntityManager.getRepository(Company).save(companyToUpdate)

      if (companyAdmin) {
        companyAdmin.company = updatedCompany
        await transactionEntityManager.getRepository(User).save(companyAdmin)
      }

      return updatedCompany
    })
  }

  public async createBusinessHost(companyId: number, user: Partial<User>): Promise<User> {
    const businessHostRole = await getRepository(UserRole)
      .createQueryBuilder('role')
      .where('role.name = :roleName', { roleName: UserRoleType.BUSINESS_HOST })
      .getOne()

    // Force rollback if role does not exist
    if (!businessHostRole) throw Error

    const company = await getRepository(Company)
      .createQueryBuilder('company')
      .where('company.id = :companyId', { companyId })
      .getOne()

    // Force rollback if company does not exist
    if (!company) throw Error

    const newBusinessHost = new User()
    newBusinessHost.email = user.email
    newBusinessHost.password = user.password
    newBusinessHost.firstName = user.firstName
    newBusinessHost.lastName = user.lastName
    newBusinessHost.role = businessHostRole
    newBusinessHost.company = company

    return getRepository(User).save(newBusinessHost)
  }

  public async updateBusinessHost(businessHostId: number, user: Partial<User>): Promise<User> {
    const businessHost = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId: businessHostId })
      .getOne()

    businessHost.firstName = user.firstName
    businessHost.lastName = user.lastName

    return getRepository(User).save(businessHost)
  }

  public async updateCompanyConfig(companyId: number, config: Partial<CompanyRegisterConfig>): Promise<CompanyRegisterConfig> {
    const company = await this.findCompanyById(companyId)

    company.registerConfig.storeNationality = config.storeNationality
    company.registerConfig.storeAddress = config.storeAddress
    company.registerConfig.storePhoneNumber = config.storePhoneNumber
    company.registerConfig.storeBirthplace = config.storeBirthplace
    company.registerConfig.storeBirthDate = config.storeBirthDate
    company.registerConfig.storeMotherName = config.storeMotherName
    company.registerConfig.storeCompany = config.storeCompany
    company.registerConfig.registerGuestCard = config.registerGuestCard
    company.registerConfig.trackActualExit = config.trackActualExit

    return getRepository(CompanyRegisterConfig).save(company.registerConfig)
  }
}

export default CompanyRepository
