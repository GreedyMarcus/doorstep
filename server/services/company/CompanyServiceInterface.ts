import { CompanyUpdateDTO, CompanyInfoDTO, CompanyVisitInfoDTO, CompanyHostInfoDTO } from '../../data/dtos/CompanyDTO'
import { ConsentFormInfoDTO } from '../../data/dtos/ConsentFormDTO'

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
}

export default CompanyServiceInterface
