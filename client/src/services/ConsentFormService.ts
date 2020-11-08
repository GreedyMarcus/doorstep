import axios from 'axios'
import AuthService from './AuthService'
import { ConsentFormDetails, ConsentFormVersionInfo } from '../data/types/ConsentForm'
import { ConsentFormType } from '../data/enums/ConsentFormType'

class ConsentFormService {
  public static async getConsentFormById(formId: number, formType: ConsentFormType): Promise<ConsentFormDetails> {
    const authHeader = AuthService.getAuthHeader()
    return axios.get<any, ConsentFormDetails>(`/api/consent-forms/${formType}/${formId}`, { headers: authHeader })
  }

  public static async createConsentFormVersion(
    formId: number,
    formType: ConsentFormType,
    content: string
  ): Promise<ConsentFormVersionInfo> {
    const authHeader = AuthService.getAuthHeader()
    return axios.post<any, ConsentFormVersionInfo>(
      `/api/consent-forms/${formType}/${formId}/versions`,
      { content },
      { headers: authHeader }
    )
  }

  public static async updateConsentFormVersion(
    formId: number,
    versionId: number,
    formType: ConsentFormType,
    content: string
  ): Promise<ConsentFormVersionInfo> {
    const authHeader = AuthService.getAuthHeader()
    return axios.patch<any, ConsentFormVersionInfo>(
      `/api/consent-forms/${formType}/${formId}/versions/${versionId}`,
      { content },
      { headers: authHeader }
    )
  }

  public static async activateGlobalConsentFormVersion(
    formId: number,
    formType: ConsentFormType,
    versionId: number
  ): Promise<ConsentFormVersionInfo> {
    const authHeader = AuthService.getAuthHeader()
    return axios.put<any, ConsentFormVersionInfo>(
      `/api/consent-forms/${formType}/${formId}/versions/${versionId}/activation`,
      {},
      { headers: authHeader }
    )
  }
}

export default ConsentFormService
