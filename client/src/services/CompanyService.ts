import axios from 'axios'
import AuthService from './AuthService'
import { CompanyInfo, CompanyUpdate, CompanyConfig } from '../data/types/Company'
import { VisitInfo } from '../data/types/Visit'
import { BusinessHostInfo, UserRegister, UserUpdate } from '../data/types/User'
import { ConsentFormInfo, ConsentFormCreate } from '../data/types/ConsentForm'

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

  public static async createBusinessHost(companyId: number, data: UserRegister): Promise<BusinessHostInfo> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${CompanyService.API_BASE}/${companyId}/business-hosts`
    const config = { headers: authHeader }

    const result = await axios.post(url, data, config)
    return result.data as BusinessHostInfo
  }

  public static async updateBusinessHost(companyId: number, hostId: number, data: UserUpdate): Promise<BusinessHostInfo> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${CompanyService.API_BASE}/${companyId}/business-hosts/${hostId}`
    const config = { headers: authHeader }

    const result = await axios.put(url, data, config)
    return result.data as BusinessHostInfo
  }

  public static async getConsentForms(companyId: number): Promise<ConsentFormInfo[]> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${CompanyService.API_BASE}/${companyId}/consent-forms`
    const config = { headers: authHeader }

    const result = await axios.get(url, config)
    return result.data as ConsentFormInfo[]
  }

  public static async createConsentForm(companyId: number, data: ConsentFormCreate): Promise<ConsentFormInfo> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${CompanyService.API_BASE}/${companyId}/consent-forms`
    const config = { headers: authHeader }

    const result = await axios.post(url, data, config)
    return result.data as ConsentFormInfo
  }

  public static async getCompanyConfig(companyId: number): Promise<CompanyConfig> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${CompanyService.API_BASE}/${companyId}/config`
    const config = { headers: authHeader }

    const result = await axios.get(url, config)
    return result.data as CompanyConfig
  }

  public static async updateCompanyConfig(companyId: number, data: CompanyConfig) {
    const authHeader = AuthService.getAuthHeader()

    const url = `${CompanyService.API_BASE}/${companyId}/config`
    const config = { headers: authHeader }

    await axios.put(url, data, config)
  }
}

export default CompanyService
