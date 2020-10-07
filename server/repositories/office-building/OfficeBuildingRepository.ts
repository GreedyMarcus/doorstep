import { EntityRepository, getRepository, Repository } from 'typeorm'
import { injectable } from 'inversify'
import OfficeBuildingRepositoryInterface from './OfficeBuildingRepositoryInterface'
import OfficeBuilding from '../../models/OfficeBuilding'
import Address from '../../models/Address'
import User from '../../models/User'

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

  public async createBuilding(address: Partial<Address>, admin: User): Promise<OfficeBuilding> {
    // Check if address exists
    let buildingAddress = await getRepository(Address)
      .createQueryBuilder('address')
      .where('address.country = :country', { country: address.country })
      .andWhere('address.zipCode = :zipCode', { zipCode: address.zipCode })
      .andWhere('address.city = :city', { city: address.city })
      .andWhere('address.streetAddress = :streetAddress', { streetAddress: address.streetAddress })
      .getOne()

    // If address not exists create one for the building
    if (!buildingAddress) {
      const newAddress = new Address()
      newAddress.country = address.country
      newAddress.zipCode = address.zipCode
      newAddress.city = address.city
      newAddress.streetAddress = address.streetAddress

      buildingAddress = await getRepository(Address).save(newAddress)
      if (!buildingAddress) {
        return null
      }
    }

    const newBuilding = new OfficeBuilding()
    newBuilding.address = buildingAddress
    newBuilding.admin = admin

    return getRepository(OfficeBuilding).save(newBuilding)
  }
}

export default OfficeBuildingRepository
