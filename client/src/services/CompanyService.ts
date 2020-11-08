import axios from 'axios'
import AuthService from './AuthService'
import { CompanyInfo, CompanyUpdate } from '../data/types/Company'

class CompanyService {
  public static async updateCompany(companyId: number, data: CompanyUpdate): Promise<CompanyInfo> {
    const authHeader = AuthService.getAuthHeader()
    return axios.put<CompanyUpdate, CompanyInfo>(`/api/companies/${companyId}`, data, { headers: authHeader })
  }
}

export default CompanyService
