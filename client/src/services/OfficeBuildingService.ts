import axios from 'axios'
import AuthService from './AuthService'
import { OfficeBuildingRegister } from '../data/types/OfficeBuilding'
import { CompanyInfo, CompanyRegister } from '../data/types/Company'
import { ConsentFormInfo, ConsentFormCreate } from '../data/types/ConsentForm'

class OfficeBuildingService {
  public static async registerBuilding(data: OfficeBuildingRegister): Promise<void> {
    await axios.post('/api/buildings/register', data)
  }

  public static async getCompaniesInBuilding(buildingId: number): Promise<CompanyInfo[]> {
    const authHeader = AuthService.getAuthHeader()
    return axios.get<any, CompanyInfo[]>(`/api/buildings/${buildingId}/companies`, { headers: authHeader })
  }

  public static async registerCompanyInBuilding(buildingId: number, data: CompanyRegister): Promise<CompanyInfo> {
    const authHeader = AuthService.getAuthHeader()
    return axios.post<CompanyRegister, CompanyInfo>(`/api/buildings/${buildingId}/companies`, data, { headers: authHeader })
  }

  public static async getGlobalConsentForms(buildingId: number): Promise<ConsentFormInfo[]> {
    const authHeader = AuthService.getAuthHeader()
    return axios.post<any, ConsentFormInfo[]>(`/api/buildings/${buildingId}/consent-forms`, { headers: authHeader })
  }

  public static async createGlobalConsentform(buildingId: number, data: ConsentFormCreate): Promise<ConsentFormInfo> {
    const authHeader = AuthService.getAuthHeader()
    return axios.post<ConsentFormCreate, ConsentFormInfo>(`/api/buildings/${buildingId}/consent-forms`, data, {
      headers: authHeader
    })
  }
}

export default OfficeBuildingService
