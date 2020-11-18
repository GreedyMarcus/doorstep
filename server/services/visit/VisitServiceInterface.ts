import {
  VisitDetailsDTO,
  GuestInvitationInfoDTO,
  GuestInvitationDetailsDTO,
  GuestUpdateByUserDTO
} from '../../data/dtos/VisitDTO'

interface VisitServiceInterface {
  /**
   * Returns the visit specified by id.
   */
  getVisitById(visitId: number): Promise<VisitDetailsDTO>

  /**
   * Returns the guest that belongs to the specified visit.
   */
  getVisitGuestById(visitId: number, guestId: number): Promise<GuestInvitationDetailsDTO>

  /**
   * Returns the upcoming visits for the specified guest user.
   */
  getGuestInvitations(userId: number): Promise<GuestInvitationInfoDTO[]>

  /**
   * Returns the guest profile to be filled for the specified invitation.
   */
  getGuestInvitationProfile(userId: number, visitId: number): Promise<GuestInvitationDetailsDTO>

  /**
   * Updates the guest profile that belongs to the specified invitation.
   */
  updateGuestInvitationProfile(userId: number, visitId: number, data: GuestUpdateByUserDTO): Promise<void>
}

export default VisitServiceInterface
