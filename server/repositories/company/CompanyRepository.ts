import Address from '../../models/Address'
import Company from '../../models/Company'
import User from '../../models/User'
import UserRole from '../../models/UserRole'
import OfficeBuilding from '../../models/OfficeBuilding'
import CompanyRegisterConfig from '../../models/CompanyRegisterConfig'
import CompanyRepositoryInterface from './CompanyRepositoryInterface'
import { EntityRepository, getManager, getRepository, Repository } from 'typeorm'
import { injectable } from 'inversify'
import { UserRoleType } from '../../data/enums/UserRoleType'

@injectable()
@EntityRepository(Company)
class CompanyRepository extends Repository<Company> implements CompanyRepositoryInterface {
  public findCompaniesByBuildingAdminId(adminId: number): Promise<Company[]> {
    return getRepository(Company)
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.address', 'address')
      .leftJoinAndSelect('company.admin', 'admin')
      .leftJoinAndSelect(OfficeBuilding, 'building', 'building.id = company.officeBuilding')
      .leftJoinAndSelect(User, 'user', 'user.id = building.admin')
      .where('user.id = :adminId', { adminId })
      .getMany()
  }

  public createCompany(company: Partial<Company>, address: Partial<Address>, admin: Partial<User>, createdBy: number): Promise<Company> {
    return getManager().transaction(async transactionEntityManager => {
      // Check if address exists
      let companyAddress = await transactionEntityManager.getRepository(Address).findOne({
        country: address.country,
        zipCode: address.zipCode,
        city: address.city,
        streetAddress: address.streetAddress
      })

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
      const companyAdminRole = await transactionEntityManager.getRepository(UserRole).findOne({ name: UserRoleType.COMPANY_ADMIN })
      if (!companyAdminRole) throw Error // Force the transaction rollback

      const newCompanyAdminUser = new User()
      newCompanyAdminUser.email = admin.email
      newCompanyAdminUser.password = admin.password
      newCompanyAdminUser.firstName = admin.firstName
      newCompanyAdminUser.lastName = admin.lastName
      newCompanyAdminUser.role = companyAdminRole

      const companyAdmin = await transactionEntityManager.getRepository(User).save(newCompanyAdminUser)

      // Save company register configs
      const newCompanyRegisterConfig = new CompanyRegisterConfig()
      const registerConfig = await transactionEntityManager.getRepository(CompanyRegisterConfig).save(newCompanyRegisterConfig)

      // Get building by building admin id
      const building = await transactionEntityManager.getRepository(OfficeBuilding).findOne({ where: { admin: { id: createdBy } } })

      // Save company with new company admin
      const newCompany = new Company()
      newCompany.name = company.name
      newCompany.registrationNumber = company.registrationNumber
      newCompany.address = companyAddress
      newCompany.admin = companyAdmin
      newCompany.registerConfig = registerConfig
      newCompany.officeBuilding = building

      // Save company for user
      const createdCompany = await transactionEntityManager.getRepository(Company).save(newCompany)
      companyAdmin.company = createdCompany
      await transactionEntityManager.getRepository(User).save(companyAdmin)

      return createdCompany
    })
  }
}

export default CompanyRepository
