import { CompanyUpdateDTO, CompanyInfoDTO } from '../../data/dtos/CompanyDTO'

interface CompanyServiceInterface {
  updateCompany(companyId: number, data: CompanyUpdateDTO): Promise<CompanyInfoDTO>
}

export default CompanyServiceInterface
