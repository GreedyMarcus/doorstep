import axios from 'axios'
import AuthService from './AuthService'
import { OfficeBuildingRegister } from '../data/types/OfficeBuilding'
import { CompanyInfo, CompanyRegister } from '../data/types/Company'
import { ConsentFormInfo, ConsentFormCreate } from '../data/types/ConsentForm'

class OfficeBuildingService {
  public static API_BASE = '/api/buildings'

  public static async registerBuilding(data: OfficeBuildingRegister): Promise<void> {
    await axios.post(`${OfficeBuildingService.API_BASE}`, data)
  }

  public static async getCompaniesInBuilding(buildingId: number): Promise<CompanyInfo[]> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${OfficeBuildingService.API_BASE}/${buildingId}/companies`
    const config = { headers: authHeader }

    const result = await axios.get(url, config)
    return result.data as CompanyInfo[]
  }

  public static async registerCompanyInBuilding(buildingId: number, data: CompanyRegister): Promise<CompanyInfo> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${OfficeBuildingService.API_BASE}/${buildingId}/companies`
    const config = { headers: authHeader }

    const result = await axios.post(url, data, config)
    return result.data as CompanyInfo
  }

  public static async getConsentForms(buildingId: number): Promise<ConsentFormInfo[]> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${OfficeBuildingService.API_BASE}/${buildingId}/consent-forms`
    const config = { headers: authHeader }

    const result = await axios.get(url, config)
    return result.data as ConsentFormInfo[]
  }

  public static async createConsentform(buildingId: number, data: ConsentFormCreate): Promise<ConsentFormInfo> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${OfficeBuildingService.API_BASE}/${buildingId}/consent-forms`
    const config = { headers: authHeader }

    const result = await axios.post(url, data, config)
    return result.data as ConsentFormInfo
  }
}

export default OfficeBuildingService
