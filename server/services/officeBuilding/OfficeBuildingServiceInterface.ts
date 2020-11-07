import { OfficeBuildingRegisterDTO } from '../../data/dtos/OfficeBuildingDTO'
import { CompanyInfoDTO, CompanyRegisterDTO } from '../../data/dtos/CompanyDTO'

interface OfficeBuildingServiceInterface {
  registerBuilding(data: OfficeBuildingRegisterDTO): Promise<void>
  getCompanies(buildingId: number): Promise<CompanyInfoDTO[]>
  registerCompany(buildingId: number, data: CompanyRegisterDTO): Promise<CompanyInfoDTO>
}

export default OfficeBuildingServiceInterface
