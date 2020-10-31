import Address from '../../models/Address'
import User from '../../models/User'
import UserRole from '../../models/UserRole'
import OfficeBuilding from '../../models/OfficeBuilding'
import OfficeBuildingRepositoryInterface from './OfficeBuildingRepositoryInterface'
import { EntityRepository, getManager, getRepository, Repository } from 'typeorm'
import { injectable } from 'inversify'
import { UserRoleType } from '../../data/enums/UserRoleType'

@injectable()
@EntityRepository(OfficeBuilding)
class OfficeBuildingRepository extends Repository<OfficeBuilding> implements OfficeBuildingRepositoryInterface {
  public findBuildingByAddress(address: Partial<Address>): Promise<OfficeBuilding> {
    return getRepository(OfficeBuilding)
      .createQueryBuilder('building')
      .leftJoinAndSelect('building.address', 'buildingAddress')
      .where('buildingAddress.country = :country', { country: address.country })
      .andWhere('buildingAddress.zipCode = :zipCode', { zipCode: address.zipCode })
      .andWhere('buildingAddress.city = :city', { city: address.city })
      .andWhere('buildingAddress.streetAddress = :streetAddress', { streetAddress: address.streetAddress })
      .getOne()
  }

  public async createBuilding(address: Partial<Address>, admin: Partial<User>): Promise<OfficeBuilding> {
    return getManager().transaction(async transactionEntityManager => {
      // Check if address exists
      let buildingAddress = await transactionEntityManager.getRepository(Address).findOne({
        country: address.country,
        zipCode: address.zipCode,
        city: address.city,
        streetAddress: address.streetAddress
      })

      // If address not exists create one for the building
      if (!buildingAddress) {
        const newAddress = new Address()
        newAddress.country = address.country
        newAddress.zipCode = address.zipCode
        newAddress.city = address.city
        newAddress.streetAddress = address.streetAddress

        buildingAddress = await transactionEntityManager.getRepository(Address).save(newAddress)
      }

      // Save building admin
      const adminRole = await transactionEntityManager.getRepository(UserRole).findOne({ name: UserRoleType.ADMIN })
      if (!adminRole) throw Error // Force the transaction rollback

      const newAdminUser = new User()
      newAdminUser.email = admin.email
      newAdminUser.password = admin.password
      newAdminUser.firstName = admin.firstName
      newAdminUser.lastName = admin.lastName
      newAdminUser.role = adminRole

      const buildingAdmin = await transactionEntityManager.getRepository(User).save(newAdminUser)

      // Save office building with new admin
      const newBuilding = new OfficeBuilding()
      newBuilding.address = buildingAddress
      newBuilding.admin = buildingAdmin

      return transactionEntityManager.getRepository(OfficeBuilding).save(newBuilding)
    })
  }
}

export default OfficeBuildingRepository
