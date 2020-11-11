import User from '../../models/User'
import Address from '../../models/Address'
import Company from '../../models/Company'
import { UserRoleType } from '../../data/enums/UserRoleType'

interface CompanyRepositoryInterface {
  /**
   * Returns the company that has the specified id.
   */
  findCompanyById(companyId: number): Promise<Company>

  /**
   * Returns all companies that has the specified office building id.
   */
  findCompaniesByBuildingId(buildingId: number): Promise<Company[]>

  /**
   * Returns all employees from the specified company that match the provided user role.
   * If user role is not provided, returns all company employee.
   * @param role - optinal user role to match
   */
  findCompanyEmployees(companyId: number, role?: UserRoleType): Promise<User[]>

  /**
   * Creates new company with the provided data in the specified office building.
   */
  createCompany(buildingId: number, company: Partial<Company>, address: Partial<Address>, admin: Partial<User>): Promise<Company>

  /**
   * Updates the specified company with the provided data.
   */
  updateCompany(company: Partial<Company>, address: Partial<Address>, admin?: Partial<User>): Promise<Company>
}

export default CompanyRepositoryInterface
