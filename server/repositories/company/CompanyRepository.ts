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
      query.andWhere('role.name = :roleName', { roleName: UserRoleType.BUSINESS_HOST })
    }

    return query.getMany()
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

    // Get company admin role for user
    const companyAdminRole = await getRepository(UserRole)
      .createQueryBuilder('role')
      .where('role.name = :roleName', { roleName: UserRoleType.COMPANY_ADMIN })
      .getOne()

    // Force rollback if role does not exist
    if (!companyAdminRole) throw Error

    // Get building for company
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

      // Save company admin
      const newCompanyAdminUser = new User()
      newCompanyAdminUser.email = admin.email
      newCompanyAdminUser.password = admin.password
      newCompanyAdminUser.firstName = admin.firstName
      newCompanyAdminUser.lastName = admin.lastName
      newCompanyAdminUser.role = companyAdminRole

      const companyAdmin = await transactionEntityManager.getRepository(User).save(newCompanyAdminUser)

      // Save company register config
      const newCompanyRegisterConfig = new CompanyRegisterConfig()
      const registerConfig = await transactionEntityManager.getRepository(CompanyRegisterConfig).save(newCompanyRegisterConfig)

      // Save office building with new admin
      const newCompany = new Company()
      newCompany.name = company.name
      newCompany.registrationNumber = company.registrationNumber
      newCompany.address = companyAddress
      newCompany.admin = companyAdmin
      newCompany.registerConfig = registerConfig
      newCompany.officeBuilding = companyBuilding

      const createdCompany = await transactionEntityManager.getRepository(Company).save(newCompany)

      // Save company for admin
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

        // Save new company admin
        const newCompanyAdminUser = new User()
        newCompanyAdminUser.email = admin.email
        newCompanyAdminUser.password = admin.password
        newCompanyAdminUser.firstName = admin.firstName
        newCompanyAdminUser.lastName = admin.lastName
        newCompanyAdminUser.role = companyAdminRole
        companyAdmin = await transactionEntityManager.getRepository(User).save(newCompanyAdminUser)
      }

      // Save company changes
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
    // Get business host role for user
    const businessHostRole = await getRepository(UserRole)
      .createQueryBuilder('role')
      .where('role.name = :roleName', { roleName: UserRoleType.BUSINESS_HOST })
      .getOne()

    // Force rollback if role does not exist
    if (!businessHostRole) throw Error

    // Get company for user
    const company = await getRepository(Company)
      .createQueryBuilder('company')
      .where('company.id = :companyId', { companyId })
      .getOne()

    // Force rollback if building does not exist
    if (!company) throw Error

    // Save business host
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
}

export default CompanyRepository
