import { CompanyInfoDTO } from '../../data/dtos/CompanyDTO'

interface CompanyServiceInterface {
  getCompaniesByBuildingAdminId(adminId: number): Promise<CompanyInfoDTO[]>
}

export default CompanyServiceInterface
