import Company from '../../models/Company'
import Address from '../../models/Address'
import User from '../../models/User'

interface CompanyRepositoryInterface {
  findCompanyById(companyId: number): Promise<Company>
  findCompaniesByBuildingId(buildingId: number): Promise<Company[]>
  findCompanyBusinessHosts(companyId: number): Promise<User[]>
  createCompany(buildingId: number, company: Partial<Company>, address: Partial<Address>, admin: Partial<User>): Promise<Company>
  updateCompany(company: Partial<Company>, address: Partial<Address>, admin?: Partial<User>): Promise<Company>
}

export default CompanyRepositoryInterface
