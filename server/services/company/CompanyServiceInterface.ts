import {
  CompanyUpdateDTO,
  CompanyInfoDTO,
  CompanyVisitInfoDTO,
  CompanyHostInfoDTO,
  CompanyRegisterConfigDTO
} from '../../data/dtos/CompanyDTO'
import { ConsentFormInfoDTO, ConsentFormCreateDTO } from '../../data/dtos/ConsentFormDTO'
import { UserRegisterDTO, UserUpdateDTO } from '../../data/dtos/UserDTO'

interface CompanyServiceInterface {
  /**
   * Updates the specified company with provided data.
   */
  updateCompany(companyId: number, data: CompanyUpdateDTO): Promise<CompanyInfoDTO>

  /**
   * Returns all visits belong to the company.
   */
  getVisits(companyId: number): Promise<CompanyVisitInfoDTO[]>

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
}

export default CompanyServiceInterface
