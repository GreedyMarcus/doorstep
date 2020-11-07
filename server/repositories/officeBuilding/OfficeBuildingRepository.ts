import Address from '../../models/Address'
import User from '../../models/User'
import UserRole from '../../models/UserRole'
import OfficeBuilding from '../../models/OfficeBuilding'
import OfficeBuildingRepositoryInterface from './OfficeBuildingRepositoryInterface'
import { injectable } from 'inversify'
import { EntityRepository, getManager, getRepository, Repository } from 'typeorm'
import { UserRoleType } from '../../data/enums/UserRoleType'

@injectable()
@EntityRepository(OfficeBuilding)
class OfficeBuildingRepository extends Repository<OfficeBuilding> implements OfficeBuildingRepositoryInterface {
  public findBuildingByAddress(address: Partial<Address>): Promise<OfficeBuilding> {
    return getRepository(OfficeBuilding)
      .createQueryBuilder('building')
      .leftJoinAndSelect('building.address', 'address')
      .where('address.country = :country', { country: address.country })
      .andWhere('address.zipCode = :zipCode', { zipCode: address.zipCode })
      .andWhere('address.city = :city', { city: address.city })
      .andWhere('address.streetAddress = :streetAddress', { streetAddress: address.streetAddress })
      .getOne()
  }

  public async createBuilding(address: Partial<Address>, admin: Partial<User>): Promise<OfficeBuilding> {
    // Check if address already exists
    let buildingAddress = await getRepository(Address)
      .createQueryBuilder('address')
      .where('address.country = :country', { country: address.country })
      .andWhere('address.zipCode = :zipCode', { zipCode: address.zipCode })
      .andWhere('address.city = :city', { city: address.city })
      .andWhere('address.streetAddress = :streetAddress', { streetAddress: address.streetAddress })
      .getOne()

    // Get admin role for user
    const adminRole = await getRepository(UserRole)
      .createQueryBuilder('role')
      .where('role.name = :roleName', { roleName: UserRoleType.ADMIN })
      .getOne()

    // Force rollback if role does not exist
    if (!adminRole) throw Error

    return getManager().transaction(async transactionEntityManager => {
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
      const newAdminUser = new User()
      newAdminUser.email = admin.email
      newAdminUser.password = admin.password
      newAdminUser.firstName = admin.firstName
      newAdminUser.lastName = admin.lastName
      newAdminUser.role = adminRole

      const buildingAdmin = await transactionEntityManager.getRepository(User).save(newAdminUser)

      // Save office building with new admin
      const newBuilding = new OfficeBuilding()
      newBuilding.admin = buildingAdmin
      newBuilding.address = buildingAddress

      return transactionEntityManager.getRepository(OfficeBuilding).save(newBuilding)
    })
  }
}

export default OfficeBuildingRepository
