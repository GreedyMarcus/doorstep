import Boom from '@hapi/boom'
import TYPES from '../../config/types'
import VisitServiceInterface from './VisitServiceInterface'
import { inject, injectable } from 'inversify'
import { VisitRepositoryInterface } from '../../repositories/visit'
import { UserRepositoryInterface } from '../../repositories/user'
import { GuestInvitationInfoDTO, VisitDetailsDTO, VisitGuestInfoDTO } from '../../data/dtos/VisitDTO'
import { ConsentFormVersionDetailsDTO } from '../../data/dtos/ConsentFormDTO'

@injectable()
class VisitService implements VisitServiceInterface {
  private readonly visitRepository: VisitRepositoryInterface
  private readonly userRepository: UserRepositoryInterface

  constructor(
    @inject(TYPES.VisitRepository) visitRepository: VisitRepositoryInterface,
    @inject(TYPES.UserRepository) userRepository: UserRepositoryInterface
  ) {
    this.visitRepository = visitRepository
    this.userRepository = userRepository
  }

  public getVisitById = async (visitId: number): Promise<VisitDetailsDTO> => {
    const foundVisit = await this.visitRepository.findVisitById(visitId)
    if (!foundVisit) {
      throw Boom.notFound('Visit does not exist.')
    }

    const invitedGuestsData: VisitGuestInfoDTO[] = foundVisit.guests.map(guest => ({
      id: guest.id,
      user: {
        email: guest.user.email,
        fullName: `${guest.user.firstName} ${guest.user.lastName}`
      },
      nationality: guest.nationality,
      phoneNumber: guest.phoneNumber,
      birthplace: guest.birthplace,
      birthDate: guest.birthDate,
      motherName: guest.motherName,
      company: !guest.company
        ? null
        : {
            name: guest.company.name,
            registrationNumber: guest.company.registrationNumber,
            address: `${guest.company.address.country}, ${guest.company.address.zipCode}, ${guest.company.address.city}, ${guest.company.address.streetAddress}`
          },
      actualEntry: guest.actualEntry,
      actualExit: guest.actualExit,
      receptionistName: guest.receptionist ? `${guest.receptionist.firstName} ${guest.receptionist.lastName}` : null,
      guestCardNumber: guest.guestCard ? guest.guestCard.identifierNumber : null,
      participationStatus: guest.participationStatus
    }))

    const consentFormVersionsToAccept: ConsentFormVersionDetailsDTO[] = foundVisit.consentFormVersions.map(version => ({
      id: version.id,
      title: version.consentForm.title,
      content: version.content
    }))

    const visitDetails: VisitDetailsDTO = {
      id: foundVisit.id,
      companyName: foundVisit.company.name,
      businessHost: {
        email: foundVisit.businessHost.email,
        fullName: `${foundVisit.businessHost.firstName} ${foundVisit.businessHost.lastName}`
      },
      purpose: foundVisit.purpose,
      room: foundVisit.room,
      plannedEntry: foundVisit.plannedEntry,
      invitedGuests: invitedGuestsData,
      consentFormVersionsToAccept
    }

    return visitDetails
  }

  public getInvitationsByUserId = async (userId: number): Promise<GuestInvitationInfoDTO[]> => {
    const foundUser = await this.userRepository.findUserById(userId)
    if (!foundUser) {
      throw Boom.notFound('User does not exist.')
    }

    const foundVisits = await this.visitRepository.findVisitsByGuestUserId(userId)
    const visitsInfo: GuestInvitationInfoDTO[] = foundVisits.map(visit => {
      const { country, zipCode, city, streetAddress } = visit.company.officeBuilding.address

      return {
        id: visit.id,
        companyName: visit.company.name,
        buildingAddress: `${country}, ${zipCode}, ${city}, ${streetAddress}`,
        businessHost: {
          fullName: `${visit.businessHost.firstName} ${visit.businessHost.lastName}`,
          email: visit.businessHost.email
        },
        purpose: visit.purpose,
        room: visit.room,
        plannedEntry: visit.plannedEntry
      }
    })

    return visitsInfo
  }
}

export default VisitService
