import { CompanyInfoDTO, CompanyRegistrationDTO, CompanyUpdateDTO } from '../../data/dtos/CompanyDTO'

interface CompanyServiceInterface {
  getCompaniesByBuildingAdminId(adminId: number): Promise<CompanyInfoDTO[]>
  registerCompany(companyData: CompanyRegistrationDTO, buildingAdminId: number): Promise<CompanyInfoDTO>
  updateCompany(companyData: CompanyUpdateDTO): Promise<CompanyInfoDTO>
}

export default CompanyServiceInterface
