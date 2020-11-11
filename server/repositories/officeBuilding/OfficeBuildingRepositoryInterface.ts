import User from '../../models/User'
import Address from '../../models/Address'
import OfficeBuilding from '../../models/OfficeBuilding'

interface OfficeBuildingRepositoryInterface {
  /**
   * Returns the building that has the specified id.
   */
  findBuildingById(buildingId: number): Promise<OfficeBuilding>

  /**
   * Returns the building that has the specified admin user id.
   */
  findBuildingByAdminId(adminId: number): Promise<OfficeBuilding>

  /**
   * Returns the building that has the specified address.
   */
  findBuildingByAddress(address: Partial<Address>): Promise<OfficeBuilding>

  /**
   * Creates a new building with the specified admin user and address.
   */
  createBuilding(admin: Partial<User>, address: Partial<Address>): Promise<OfficeBuilding>
}

export default OfficeBuildingRepositoryInterface
