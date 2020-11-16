import { CompanyUpdateDTO, CompanyInfoDTO, CompanyHostInfoDTO, CompanyRegisterConfigDTO } from '../../data/dtos/CompanyDTO'
import { ConsentFormInfoDTO, ConsentFormCreateDTO } from '../../data/dtos/ConsentFormDTO'
import { UserRegisterDTO, UserUpdateDTO, GuestUserRegisterDTO } from '../../data/dtos/UserDTO'
import { VisitInfoDTO, VisitCreateDTO, PlannedVisitInfoDTO } from '../../data/dtos/VisitDTO'

interface CompanyServiceInterface {
  /**
   * Updates the specified company with provided data.
   */
  updateCompany(companyId: number, data: CompanyUpdateDTO): Promise<CompanyInfoDTO>

  /**
   * Returns all visits belong to the company.
   */
  getVisits(companyId: number): Promise<VisitInfoDTO[]>

  /**
   * Creates a new visit for the company.
   */
  createVisit(companyId: number, data: VisitCreateDTO): Promise<VisitInfoDTO>

  /**
   * Returns all the business hosts employed by the company.
   */
  getBusinessHosts(companyId: number): Promise<CompanyHostInfoDTO[]>

  /**
   * Creates a new business host for the company.
   */
  createBusinessHost(companyId: number, data: UserRegisterDTO): Promise<CompanyHostInfoDTO>

  /**
   * Updates the specified business host with provided data.
   */
  updateBusinessHost(companyId: number, hostId: number, data: UserUpdateDTO): Promise<CompanyHostInfoDTO>

  /**
   * Returns all the planned visits for the business host employed by the company.
   */
  getPlannedVisits(companyId: number, hostId: number): Promise<PlannedVisitInfoDTO[]>

  /**
   * Returns all consent forms belong to the company.
   */
  getConsentForms(companyId: number): Promise<ConsentFormInfoDTO[]>

  /**
   * Creates a new consent form for the company.
   */
  createConsentForm(companyId: number, data: ConsentFormCreateDTO): Promise<ConsentFormInfoDTO>

  /**
   * Returns the register config information that belongs to the company.
   */
  getCompanyConfig(companyId: number): Promise<CompanyRegisterConfigDTO>

  /**
   * Updates the register config information that belongs to the company.
   */
  updateCompanyConfig(companyId: number, data: CompanyRegisterConfigDTO): Promise<void>

  /**
   * Returns all available guest user data that belongs to the company.
   */
  getAvailableGuestUsers(companyId: number): Promise<GuestUserRegisterDTO[]>
}

export default CompanyServiceInterface
