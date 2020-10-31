import { CompanyInfoDTO, CompanyRegistrationDTO } from '../../data/dtos/CompanyDTO'

interface CompanyServiceInterface {
  getCompaniesByBuildingAdminId(adminId: number): Promise<CompanyInfoDTO[]>
  registerCompany(companyData: CompanyRegistrationDTO, buildingAdminId: number): Promise<CompanyInfoDTO>
}

export default CompanyServiceInterface
