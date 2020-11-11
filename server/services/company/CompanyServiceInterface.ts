import { CompanyUpdateDTO, CompanyInfoDTO, CompanyVisitInfoDTO, CompanyHostInfoDTO } from '../../data/dtos/CompanyDTO'

interface CompanyServiceInterface {
  /**
   * Updates the specified company with provided data.
   */
  updateCompany(companyId: number, data: CompanyUpdateDTO): Promise<CompanyInfoDTO>

  /**
   * Returns all visits belong to company.
   */
  getVisits(companyId: number): Promise<CompanyVisitInfoDTO[]>

  /**
   * Returns all the business hosts employed by the company.
   */
  getBusinessHosts(companyId: number): Promise<CompanyHostInfoDTO[]>
}

export default CompanyServiceInterface
