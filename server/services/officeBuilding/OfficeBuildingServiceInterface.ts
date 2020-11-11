import { OfficeBuildingRegisterDTO } from '../../data/dtos/OfficeBuildingDTO'
import { CompanyInfoDTO, CompanyRegisterDTO } from '../../data/dtos/CompanyDTO'
import { ConsentFormCreateDTO, ConsentFormInfoDTO } from '../../data/dtos/ConsentFormDTO'

interface OfficeBuildingServiceInterface {
  /**
   * Creates new office building with the provided data.
   */
  registerBuilding(data: OfficeBuildingRegisterDTO): Promise<void>

  /**
   * Returns all the companies belong to the specified office building.
   */
  getCompanies(buildingId: number): Promise<CompanyInfoDTO[]>

  /**
   * Creates new company in the specified office building.
   */
  registerCompany(buildingId: number, data: CompanyRegisterDTO): Promise<CompanyInfoDTO>

  /**
   * Returns all the consent forms belong to the specified office building.
   */
  getConsentForms(buildingId: number): Promise<ConsentFormInfoDTO[]>

  /**
   * Creates new consent form in the specified office building.
   */
  createConsentForm(buildingId: number, data: ConsentFormCreateDTO): Promise<ConsentFormInfoDTO>
}

export default OfficeBuildingServiceInterface
