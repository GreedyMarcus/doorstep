import axios from 'axios'
import AuthService from './AuthService'
import { CompanyInfo } from '../data/types/Company'

class CompanyService {
  public static async fetchCompanies(): Promise<CompanyInfo[]> {
    const result = await axios.get('/api/companies', { headers: AuthService.getAuthHeader() })
    return result.data
  }
}

export default CompanyService
