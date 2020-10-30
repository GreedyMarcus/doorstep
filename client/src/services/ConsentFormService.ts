import axios from 'axios'
import AuthService from './AuthService'
import { ConsentFormInfo } from '../data/types/ConsentForm'

class ConsentFormService {
  public static async fetchConsentForms(): Promise<ConsentFormInfo[]> {
    const result = await axios.get('/api/consent-forms', { headers: AuthService.getAuthHeader() })
    return result.data
  }
}

export default ConsentFormService
