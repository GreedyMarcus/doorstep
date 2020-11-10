import axios from 'axios'
import AuthService from './AuthService'
import { CompanyInfo, CompanyUpdate } from '../data/types/Company'
import { VisitInfo } from '../data/types/Visit'
import { BusinessHostInfo } from '../data/types/User'

class CompanyService {
  public static API_BASE = '/api/companies'

  public static async updateCompany(companyId: number, data: CompanyUpdate): Promise<CompanyInfo> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${CompanyService.API_BASE}/${companyId}`
    const config = { headers: authHeader }

    const result = await axios.put(url, data, config)
    return result.data as CompanyInfo
  }

  public static async getVisits(companyId: number): Promise<VisitInfo[]> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${CompanyService.API_BASE}/${companyId}/visits`
    const config = { headers: authHeader }

    const result = await axios.get(url, config)
    return result.data as VisitInfo[]
  }

  public static async getBusinessHosts(companyId: number): Promise<BusinessHostInfo[]> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${CompanyService.API_BASE}/${companyId}/business-hosts`
    const config = { headers: authHeader }

    const result = await axios.get(url, config)
    return result.data as BusinessHostInfo[]
  }
}

export default CompanyService
