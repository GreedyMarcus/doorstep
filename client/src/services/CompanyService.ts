import axios from 'axios'
import AuthService from './AuthService'
import { CompanyInfo, CompanyUpdate } from '../data/types/Company'

class CompanyService {
  public static API_BASE = '/api/companies'

  public static async updateCompany(companyId: number, data: CompanyUpdate): Promise<CompanyInfo> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${CompanyService.API_BASE}/${companyId}`
    const config = { headers: authHeader }

    const result = await axios.put(url, data, config)
    return result.data as CompanyInfo
  }
}

export default CompanyService
