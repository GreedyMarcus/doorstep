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
      .leftJoinAndSelect('company.admin', 'admin')
      .where('company.id = :companyId', { companyId })
      .getOne()
  }

  public findCompaniesByBuildingId(buildingId: number): Promise<Company[]> {
    return getRepository(Company)
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.address', 'address')
      .leftJoinAndSelect('company.admin', 'admin')
      .where('company.officeBuilding = :buildingId', { buildingId })
      .getMany()
  }

  public findCompanyBusinessHosts(companyId: number): Promise<User[]> {
    return getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('role.name = :roleName', { roleName: UserRoleType.BUSINESS_HOST })
      .andWhere('user.company = :companyId', { companyId })
      .andWhere('user.deletedAt is NULL')
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

    // Get company admin role for user
    const companyAdminRole = await getRepository(UserRole)
      .createQueryBuilder('role')
      .where('role.name = :roleName', { roleName: UserRoleType.ADMIN })
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
}

export default CompanyRepository
