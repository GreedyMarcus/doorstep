import User from '../../models/User'
import Address from '../../models/Address'
import OfficeBuilding from '../../models/OfficeBuilding'

interface OfficeBuildingRepositoryInterface {
  findBuildingByAddress(address: Partial<Address>): Promise<OfficeBuilding>
  createBuilding(address: Partial<Address>, admin: Partial<User>): Promise<OfficeBuilding>
}

export default OfficeBuildingRepositoryInterface
