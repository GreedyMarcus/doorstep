import { VisitDetailsDTO, GuestInvitationInfoDTO } from '../../data/dtos/VisitDTO'

interface VisitServiceInterface {
  /**
   * Returns the visit specified by id.
   */
  getVisitById(formId: number): Promise<VisitDetailsDTO>

  /**
   * Returns the upcoming visits for the specified guest user.
   */
  getInvitationsByUserId(userId: number): Promise<GuestInvitationInfoDTO[]>
}

export default VisitServiceInterface
