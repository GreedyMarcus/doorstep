import { CompanyUpdateDTO, CompanyInfoDTO, CompanyVisitInfoDTO, CompanyHostInfoDTO } from '../../data/dtos/CompanyDTO'
import { ConsentFormInfoDTO } from '../../data/dtos/ConsentFormDTO'
import { UserRegisterDTO } from '../../data/dtos/UserDTO'

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
   * Returns all consent forms belong to the company.
   */
  getConsentForms(companyId: number): Promise<ConsentFormInfoDTO[]>

  /**
   * Creates a new business host for the company.
   */
  createBusinessHost(companyId: number, data: UserRegisterDTO): Promise<CompanyHostInfoDTO>
}

export default CompanyServiceInterface
