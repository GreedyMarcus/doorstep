import Company from '../../models/Company'
import Address from '../../models/Address'
import User from '../../models/User'

interface CompanyRepositoryInterface {
  findCompanyById(companyId: number): Promise<Company>
  findCompaniesByBuildingAdminId(adminId: number): Promise<Company[]>
  createCompany(company: Partial<Company>, address: Partial<Address>, admin: Partial<User>, createdBy: number): Promise<Company>
  updateCompany(company: Partial<Company>, address: Partial<Address>, admin?: Partial<User>): Promise<Company>
}

export default CompanyRepositoryInterface
