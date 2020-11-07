import User from '../../models/User'
import Address from '../../models/Address'
import OfficeBuilding from '../../models/OfficeBuilding'

interface OfficeBuildingRepositoryInterface {
  findBuildingByAddress(address: Partial<Address>): Promise<OfficeBuilding>
  createBuilding(admin: Partial<User>, address: Partial<Address>): Promise<OfficeBuilding>
}

export default OfficeBuildingRepositoryInterface
