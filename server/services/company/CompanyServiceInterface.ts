import { CompanyUpdateDTO, CompanyInfoDTO, CompanyVisitInfoDTO } from '../../data/dtos/CompanyDTO'

interface CompanyServiceInterface {
  updateCompany(companyId: number, data: CompanyUpdateDTO): Promise<CompanyInfoDTO>
  getVisits(companyId: number): Promise<CompanyVisitInfoDTO[]>
}

export default CompanyServiceInterface
