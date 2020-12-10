import Address from '../../models/Address'
import User from '../../models/User'
import UserRole from '../../models/UserRole'
import OfficeBuilding from '../../models/OfficeBuilding'
import OfficeBuildingRepositoryInterface from './OfficeBuildingRepositoryInterface'
import { injectable } from 'inversify'
import { EntityRepository, getManager, getRepository, Repository } from 'typeorm'
import { UserRoleType } from '../../data/enums/UserRoleType'

/**
 * Repository that handles office building data manipulation.
 */
@injectable()
@EntityRepository(OfficeBuilding)
class OfficeBuildingRepository extends Repository<OfficeBuilding> implements OfficeBuildingRepositoryInterface {
  public findBuildingById(buildingId: number): Promise<OfficeBuilding> {
    return getRepository(OfficeBuilding)
      .createQueryBuilder('building')
      .leftJoinAndSelect('building.admin', 'admin')
      .leftJoinAndSelect('building.address', 'address')
      .leftJoinAndSelect('building.employees', 'employees')
      .where('building.id = :buildingId', { buildingId })
      .getOne()
  }

  public findBuildingByAdminId(adminId: number): Promise<OfficeBuilding> {
    return getRepository(OfficeBuilding)
      .createQueryBuilder('building')
      .leftJoinAndSelect('building.admin', 'admin')
      .leftJoinAndSelect('building.address', 'address')
      .where('admin.id = :adminId', { adminId })
      .getOne()
  }

  public findBuildingByAddress(address: Partial<Address>): Promise<OfficeBuilding> {
    return getRepository(OfficeBuilding)
      .createQueryBuilder('building')
      .leftJoinAndSelect('building.admin', 'admin')
      .leftJoinAndSelect('building.address', 'address')
      .where('address.country = :country', { country: address.country })
      .andWhere('address.zipCode = :zipCode', { zipCode: address.zipCode })
      .andWhere('address.city = :city', { city: address.city })
      .andWhere('address.streetAddress = :streetAddress', { streetAddress: address.streetAddress })
      .getOne()
  }

  public findBuildingEmployees(buildingId: number, role?: UserRoleType): Promise<User[]> {
    const query = getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.officeBuilding = :buildingId', { buildingId })

    if (role) {
      query.andWhere('role.name = :roleName', { roleName: role })
    }

    return query.getMany()
  }

  public async createBuilding(admin: Partial<User>, address: Partial<Address>): Promise<OfficeBuilding> {
    // Check if address already exists
    let buildingAddress = await getRepository(Address)
      .createQueryBuilder('address')
      .where('address.country = :country', { country: address.country })
      .andWhere('address.zipCode = :zipCode', { zipCode: address.zipCode })
      .andWhere('address.city = :city', { city: address.city })
      .andWhere('address.streetAddress = :streetAddress', { streetAddress: address.streetAddress })
      .getOne()

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

      const newAdminUser = new User()
      newAdminUser.email = admin.email
      newAdminUser.password = admin.password
      newAdminUser.firstName = admin.firstName
      newAdminUser.lastName = admin.lastName
      newAdminUser.role = adminRole

      const buildingAdmin = await transactionEntityManager.getRepository(User).save(newAdminUser)

      const newBuilding = new OfficeBuilding()
      newBuilding.admin = buildingAdmin
      newBuilding.address = buildingAddress

      return transactionEntityManager.getRepository(OfficeBuilding).save(newBuilding)
    })
  }

  public async createReceptionist(buildingId: number, user: Partial<User>): Promise<User> {
    const receptionistRole = await getRepository(UserRole)
      .createQueryBuilder('role')
      .where('role.name = :roleName', { roleName: UserRoleType.RECEPTIONIST })
      .getOne()

    // Force rollback if role does not exist
    if (!receptionistRole) throw Error

    const building = await getRepository(OfficeBuilding)
      .createQueryBuilder('building')
      .where('building.id = :buildingId', { buildingId })
      .getOne()

    // Force rollback if building does not exist
    if (!building) throw Error

    const newReceptionist = new User()
    newReceptionist.email = user.email
    newReceptionist.password = user.password
    newReceptionist.firstName = user.firstName
    newReceptionist.lastName = user.lastName
    newReceptionist.role = receptionistRole
    newReceptionist.officeBuilding = building

    return getRepository(User).save(newReceptionist)
  }

  public async updateReceptionist(receptionistId: number, user: Partial<User>): Promise<User> {
    const receptionist = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId: receptionistId })
      .getOne()

    receptionist.firstName = user.firstName
    receptionist.lastName = user.lastName

    return getRepository(User).save(receptionist)
  }
}

export default OfficeBuildingRepository
