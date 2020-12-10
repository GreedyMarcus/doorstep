import User from '../../models/User'
import Address from '../../models/Address'
import OfficeBuilding from '../../models/OfficeBuilding'
import { UserRoleType } from '../../data/enums/UserRoleType'

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
   * Returns all employees from the specified office building that match the provided user role.
   * If user role is not provided, returns all office building employee.
   *
   * @param role - optinal user role to match
   */
  findBuildingEmployees(buildingId: number, role?: UserRoleType): Promise<User[]>

  /**
   * Creates a new building with the specified admin user and address.
   */
  createBuilding(admin: Partial<User>, address: Partial<Address>): Promise<OfficeBuilding>

  /**
   * Creates a new receptionist with the provided data in the specified office building.
   */
  createReceptionist(buildingId: number, user: Partial<User>): Promise<User>

  /**
   * Updates the specified receptionist with the provided data.
   */
  updateReceptionist(receptionistId: number, user: Partial<User>): Promise<User>
}

export default OfficeBuildingRepositoryInterface
