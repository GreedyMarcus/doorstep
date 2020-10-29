import Company from '../../models/Company'

interface CompanyRepositoryInterface {
  findCompaniesByBuildingAdminId(adminId: number): Promise<Company[]>
}

export default CompanyRepositoryInterface
