import { OfficeBuildingRegisterDTO } from '../../data/dtos/OfficeBuildingDTO'
import { CompanyInfoDTO, CompanyRegisterDTO, EmployeeInfoDTO } from '../../data/dtos/CompanyDTO'
import { ConsentFormCreateDTO, ConsentFormInfoDTO } from '../../data/dtos/ConsentFormDTO'
import { UserRegisterDTO, UserUpdateDTO } from '../../data/dtos/UserDTO'
import { InvitationInfoDTO } from '../../data/dtos/VisitDTO'

interface OfficeBuildingServiceInterface {
  /**
   * Creates a new office building with the provided data.
   */
  registerBuilding(data: OfficeBuildingRegisterDTO): Promise<void>

  /**
   * Returns all the companies belong to the specified office building.
   */
  getCompanies(buildingId: number): Promise<CompanyInfoDTO[]>

  /**
   * Creates a new company in the specified office building.
   */
  registerCompany(buildingId: number, data: CompanyRegisterDTO): Promise<CompanyInfoDTO>

  /**
   * Returns all the consent forms belong to the specified office building.
   */
  getConsentForms(buildingId: number): Promise<ConsentFormInfoDTO[]>

  /**
   * Creates a new consent form in the specified office building.
   */
  createConsentForm(buildingId: number, data: ConsentFormCreateDTO): Promise<ConsentFormInfoDTO>

  /**
   * Returns all the receptionists employed by the office building.
   */
  getReceptionists(buildingId: number): Promise<EmployeeInfoDTO[]>

  /**
   * Creates a new receptionist for the office building.
   */
  createReceptionist(buildingId: number, data: UserRegisterDTO): Promise<EmployeeInfoDTO>

  /**
   * Updates the specified receptionist with provided data.
   */
  updateReceptionist(buildingId: number, receptionistId: number, data: UserUpdateDTO): Promise<EmployeeInfoDTO>

  /**
   * Returns all the invitations for the specified building.
   */
  getInvitations(buildingId: number): Promise<InvitationInfoDTO[]>
}

export default OfficeBuildingServiceInterface
