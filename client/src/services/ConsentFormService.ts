import axios from 'axios'
import AuthService from './AuthService'
import { ConsentFormInfo, ConsentFormCreate } from '../data/types/ConsentForm'
import { ConsentFormType } from '../data/enums/ConsentFormType'

class ConsentFormService {
  public static async fetchConsentForms(type: ConsentFormType): Promise<ConsentFormInfo[]> {
    const result = await axios.get(`/api/consent-forms/${type}`, { headers: AuthService.getAuthHeader() })
    return result.data
  }

  public static async createGlobalConsentForm(consentFormData: ConsentFormCreate): Promise<ConsentFormInfo> {
    const result = await axios.post('/api/consent-forms/global', consentFormData, { headers: AuthService.getAuthHeader() })
    return result.data
  }
}

export default ConsentFormService
