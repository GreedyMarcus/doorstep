import axios from 'axios'
import AuthService from './AuthService'
import { VisitDetails, GuestInvitationInfo, GuestInvitationDetails, GuestUpdateByUser } from '../data/types/Visit'

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

  public static async getVisitGuestById(visitId: number, guestId: number): Promise<GuestInvitationDetails> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${ConsentFormService.API_BASE}/${visitId}/guests/${guestId}`
    const config = { headers: authHeader }

    const result = await axios.get(url, config)
    return result.data as GuestInvitationDetails
  }

  public static async getGuestInvitations(userId: number): Promise<GuestInvitationInfo[]> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${ConsentFormService.API_BASE}/guest-invitations/${userId}`
    const config = { headers: authHeader }

    const result = await axios.get(url, config)
    return result.data as GuestInvitationInfo[]
  }

  public static async getGuestInvitationProfile(userId: number, visitId: number): Promise<GuestInvitationDetails> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${ConsentFormService.API_BASE}/guest-invitations/${userId}/profiles/${visitId}`
    const config = { headers: authHeader }

    const result = await axios.get(url, config)
    return result.data as GuestInvitationDetails
  }

  public static async updateGuestInvitationProfile(userId: number, visitId: number, data: GuestUpdateByUser): Promise<void> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${ConsentFormService.API_BASE}/guest-invitations/${userId}/profiles/${visitId}`
    const config = { headers: authHeader }

    await axios.put(url, data, config)
  }
}

export default ConsentFormService
