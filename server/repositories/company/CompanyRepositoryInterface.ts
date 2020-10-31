import Company from '../../models/Company'
import Address from '../../models/Address'
import User from '../../models/User'

interface CompanyRepositoryInterface {
  findCompaniesByBuildingAdminId(adminId: number): Promise<Company[]>
  createCompany(company: Partial<Company>, address: Partial<Address>, admin: Partial<User>, createdBy: number): Promise<Company>
}

export default CompanyRepositoryInterface
