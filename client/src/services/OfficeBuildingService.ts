import axios from 'axios'
import AuthService from './AuthService'
import { OfficeBuildingRegister } from '../data/types/OfficeBuilding'
import { CompanyInfo, CompanyRegister } from '../data/types/Company'
import { ConsentFormInfo, ConsentFormCreate } from '../data/types/ConsentForm'
import { EmployeeInfo, UserRegister, UserUpdate } from '../data/types/User'

/**
 * Wrapper class that manages API calls to the office building related endpoints.
 */
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

  public static async createConsentForm(buildingId: number, data: ConsentFormCreate): Promise<ConsentFormInfo> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${OfficeBuildingService.API_BASE}/${buildingId}/consent-forms`
    const config = { headers: authHeader }

    const result = await axios.post(url, data, config)
    return result.data as ConsentFormInfo
  }

  public static async getReceptionists(buildingId: number): Promise<EmployeeInfo[]> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${OfficeBuildingService.API_BASE}/${buildingId}/receptionists`
    const config = { headers: authHeader }

    const result = await axios.get(url, config)
    return result.data as EmployeeInfo[]
  }

  public static async createReceptionist(buildingId: number, data: UserRegister): Promise<EmployeeInfo> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${OfficeBuildingService.API_BASE}/${buildingId}/receptionists`
    const config = { headers: authHeader }

    const result = await axios.post(url, data, config)
    return result.data as EmployeeInfo
  }

  public static async updateReceptionist(companyId: number, receptionistId: number, data: UserUpdate): Promise<EmployeeInfo> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${OfficeBuildingService.API_BASE}/${companyId}/receptionists/${receptionistId}`
    const config = { headers: authHeader }

    const result = await axios.put(url, data, config)
    return result.data as EmployeeInfo
  }
}

export default OfficeBuildingService
