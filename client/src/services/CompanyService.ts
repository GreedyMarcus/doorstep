import axios from 'axios'
import AuthService from './AuthService'
import { CompanyInfo, RegisterCompanyDetails } from '../data/types/Company'

class CompanyService {
  public static async fetchCompanies(): Promise<CompanyInfo[]> {
    const result = await axios.get('/api/companies', { headers: AuthService.getAuthHeader() })
    return result.data
  }

  public static async registerCompany(company: RegisterCompanyDetails): Promise<CompanyInfo> {
    const result = await axios.post('/api/companies', company, { headers: AuthService.getAuthHeader() })
    return result.data
  }
}

export default CompanyService
