import axios from 'axios'
import AuthService from './AuthService'
import { VisitDetails } from '../data/types/Visit'

/**
 * Wrapper class that manages API calls to the visit related endpoints.
 */
class ConsentFormService {
  public static API_BASE = '/api/visits'

  public static async getVisitById(visitId: number): Promise<VisitDetails> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${ConsentFormService.API_BASE}/${visitId}`
    const config = { headers: authHeader }

    const result = await axios.get(url, config)
    return result.data as VisitDetails
  }
}

export default ConsentFormService
