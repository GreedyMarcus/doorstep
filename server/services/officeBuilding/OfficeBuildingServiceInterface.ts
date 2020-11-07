import { OfficeBuildingRegisterDTO } from '../../data/dtos/OfficeBuildingDTO'
import { CompanyInfoDTO, CompanyRegisterDTO } from '../../data/dtos/CompanyDTO'
import { ConsentFormCreateDTO, ConsentFormInfoDTO } from '../../data/dtos/ConsentFormDTO'

interface OfficeBuildingServiceInterface {
  registerBuilding(data: OfficeBuildingRegisterDTO): Promise<void>
  getCompanies(buildingId: number): Promise<CompanyInfoDTO[]>
  registerCompany(buildingId: number, data: CompanyRegisterDTO): Promise<CompanyInfoDTO>
  getConsentForms(buildingId: number): Promise<ConsentFormInfoDTO[]>
  createConsentForm(buildingId: number, data: ConsentFormCreateDTO): Promise<ConsentFormInfoDTO>
}

export default OfficeBuildingServiceInterface
