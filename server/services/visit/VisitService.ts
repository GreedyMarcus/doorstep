import Boom from '@hapi/boom'
import TYPES from '../../config/types'
import VisitServiceInterface from './VisitServiceInterface'
import { inject, injectable } from 'inversify'
import { VisitRepositoryInterface } from '../../repositories/visit'
import { VisitDetailsDTO, VisitGuestInfoDTO } from '../../data/dtos/VisitDTO'
import { ConsentFormVersionDetailsDTO } from '../../data/dtos/ConsentFormDTO'

@injectable()
class VisitService implements VisitServiceInterface {
  private readonly visitRepository: VisitRepositoryInterface

  constructor(@inject(TYPES.VisitRepository) visitRepository: VisitRepositoryInterface) {
    this.visitRepository = visitRepository
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
}

export default VisitService
