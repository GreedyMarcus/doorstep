import User from '../../models/User'
import Address from '../../models/Address'
import OfficeBuilding from '../../models/OfficeBuilding'

interface OfficeBuildingRepositoryInterface {
  findBuildingById(buildingId: number): Promise<OfficeBuilding>
  findBuildingByAddress(address: Partial<Address>): Promise<OfficeBuilding>
  createBuilding(admin: Partial<User>, address: Partial<Address>): Promise<OfficeBuilding>
}

export default OfficeBuildingRepositoryInterface
