import axios from 'axios'
import AuthService from './AuthService'
import { ConsentFormInfo, ConsentFormCreate, ConsentFormDetails, ConsentFormVersionInfo } from '../data/types/ConsentForm'
import { ConsentFormType } from '../data/enums/ConsentFormType'

class ConsentFormService {
  public static async fetchConsentForms(consentFormType: ConsentFormType): Promise<ConsentFormInfo[]> {
    const result = await axios.get(`/api/consent-forms/${consentFormType}`, { headers: AuthService.getAuthHeader() })
    return result.data
  }

  public static async fetchConsentFormById(consentFormId: number, consentFormType: ConsentFormType): Promise<ConsentFormDetails> {
    const result = await axios.get(`/api/consent-forms/${consentFormType}/${consentFormId}`, { headers: AuthService.getAuthHeader() })
    return result.data
  }

  public static async createGlobalConsentForm(consentFormData: ConsentFormCreate): Promise<ConsentFormInfo> {
    const result = await axios.post('/api/consent-forms/global', consentFormData, { headers: AuthService.getAuthHeader() })
    return result.data
  }

  public static async createGlobalConsentFormVersion(formId: number, versionContent: string): Promise<ConsentFormVersionInfo> {
    const result = await axios.post(
      `/api/consent-forms/global/${formId}/versions`,
      { content: versionContent },
      { headers: AuthService.getAuthHeader() }
    )
    return result.data
  }

  public static async updateGlobalConsentFormVersion(formId: number, versionId: number, content: string): Promise<ConsentFormVersionInfo> {
    const result = await axios.patch(
      `/api/consent-forms/global/${formId}/versions/${versionId}`,
      { content },
      { headers: AuthService.getAuthHeader() }
    )
    return result.data
  }

  public static async activateGlobalConsentFormVersion(formId: number, versionId: number): Promise<ConsentFormVersionInfo> {
    const result = await axios.put(`/api/consent-forms/global/${formId}/versions/${versionId}/activation`, undefined, {
      headers: AuthService.getAuthHeader()
    })
    return result.data
  }
}

export default ConsentFormService
