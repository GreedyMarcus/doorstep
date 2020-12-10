import axios from 'axios'
import AuthService from './AuthService'
import { ConsentFormDetails, ConsentFormVersionInfo } from '../data/types/ConsentForm'
import { ConsentFormType } from '../data/enums/ConsentFormType'

/**
 * Wrapper class that manages API calls to the consent form related endpoints.
 */
class ConsentFormService {
  public static API_BASE = '/api/consent-forms'

  public static async getConsentFormById(formId: number, type: ConsentFormType): Promise<ConsentFormDetails> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${ConsentFormService.API_BASE}/${type}/${formId}`
    const config = { headers: authHeader }

    const result = await axios.get(url, config)
    return result.data as ConsentFormDetails
  }

  public static async createConsentFormVersion(
    formId: number,
    type: ConsentFormType,
    content: string
  ): Promise<ConsentFormVersionInfo> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${ConsentFormService.API_BASE}/${type}/${formId}/versions`
    const data = { content }
    const config = { headers: authHeader }

    const result = await axios.post(url, data, config)
    return result.data as ConsentFormVersionInfo
  }

  public static async updateConsentFormVersion(
    formId: number,
    versionId: number,
    type: ConsentFormType,
    content: string
  ): Promise<ConsentFormVersionInfo> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${ConsentFormService.API_BASE}/${type}/${formId}/versions/${versionId}`
    const data = { content }
    const config = { headers: authHeader }

    const result = await axios.patch(url, data, config)
    return result.data as ConsentFormVersionInfo
  }

  public static async activateConsentFormVersion(
    formId: number,
    type: ConsentFormType,
    versionId: number
  ): Promise<ConsentFormVersionInfo> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${ConsentFormService.API_BASE}/${type}/${formId}/versions/${versionId}/activation`
    const data = {}
    const config = { headers: authHeader }

    const result = await axios.put(url, data, config)
    return result.data as ConsentFormVersionInfo
  }
}

export default ConsentFormService
