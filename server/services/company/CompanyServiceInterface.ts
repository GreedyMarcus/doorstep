import { CompanyUpdateDTO, CompanyInfoDTO, CompanyVisitInfoDTO, CompanyHostInfoDTO } from '../../data/dtos/CompanyDTO'

interface CompanyServiceInterface {
  updateCompany(companyId: number, data: CompanyUpdateDTO): Promise<CompanyInfoDTO>
  getVisits(companyId: number): Promise<CompanyVisitInfoDTO[]>
  getBusinessHosts(companyId: number): Promise<CompanyHostInfoDTO[]>
}

export default CompanyServiceInterface
