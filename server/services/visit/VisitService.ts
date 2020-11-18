import Boom from '@hapi/boom'
import TYPES from '../../config/types'
import VisitServiceInterface from './VisitServiceInterface'
import { inject, injectable } from 'inversify'
import { CompanyServiceInterface } from '../company'
import { VisitRepositoryInterface } from '../../repositories/visit'
import { UserRepositoryInterface } from '../../repositories/user'
import { GuestInvitationInfoDTO, VisitDetailsDTO, VisitGuestInfoDTO, GuestInvitationDetailsDTO } from '../../data/dtos/VisitDTO'
import { ConsentFormVersionDetailsDTO } from '../../data/dtos/ConsentFormDTO'

@injectable()
class VisitService implements VisitServiceInterface {
  private readonly companyService: CompanyServiceInterface
  private readonly visitRepository: VisitRepositoryInterface
  private readonly userRepository: UserRepositoryInterface

  constructor(
    @inject(TYPES.CompanyService) companyService: CompanyServiceInterface,
    @inject(TYPES.VisitRepository) visitRepository: VisitRepositoryInterface,
    @inject(TYPES.UserRepository) userRepository: UserRepositoryInterface
  ) {
    this.companyService = companyService
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
            address: guest.company.address
              ? `${guest.company.address.country}, ${guest.company.address.zipCode}, ${guest.company.address.city}, ${guest.company.address.streetAddress}`
              : null
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

  public getGuestInvitations = async (userId: number): Promise<GuestInvitationInfoDTO[]> => {
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

  public getGuestInvitationProfile = async (userId: number, visitId: number): Promise<GuestInvitationDetailsDTO> => {
    const foundUser = await this.userRepository.findUserById(userId)
    if (!foundUser) {
      throw Boom.notFound('User does not exist.')
    }

    const foundVisit = await this.visitRepository.findVisitById(visitId)
    if (!foundVisit) {
      throw Boom.notFound('Visit does not exist.')
    }

    const visitGuest = foundVisit.guests.filter(guest => guest.user.id === userId)[0]
    if (!visitGuest) {
      throw Boom.notFound('Guest user does not exist.')
    }

    const companyRegisterConfig = await this.companyService.getCompanyConfig(foundVisit.company.id)
    if (!companyRegisterConfig) {
      throw Boom.notFound('Company register config does not exist.')
    }

    const officeAddress = foundVisit.company.officeBuilding.address
    const visitAddress = visitGuest.address
    const consentFormVersionsToAccept: ConsentFormVersionDetailsDTO[] = foundVisit.consentFormVersions.map(version => ({
      id: version.id,
      title: version.consentForm.title,
      content: version.content
    }))
    const consentFormVersionsAccepted: number[] = visitGuest.consentFormVersions.map(version => version.id)

    const visitDetails: GuestInvitationDetailsDTO = {
      invitationInfo: {
        id: foundVisit.id,
        companyName: foundVisit.company.name,
        buildingAddress: `${officeAddress.country}, ${officeAddress.zipCode}, ${officeAddress.city}, ${officeAddress.streetAddress}`,
        businessHost: {
          fullName: `${foundVisit.businessHost.firstName} ${foundVisit.businessHost.lastName}`,
          email: foundVisit.businessHost.email
        },
        purpose: foundVisit.purpose,
        room: foundVisit.room,
        plannedEntry: foundVisit.plannedEntry
      },
      guestDetails: {
        id: visitGuest.id,
        user: {
          email: visitGuest.user.email,
          fullName: `${visitGuest.user.firstName} ${visitGuest.user.lastName}`
        },
        nationality: visitGuest.nationality,
        phoneNumber: visitGuest.phoneNumber,
        birthplace: visitGuest.birthplace,
        birthDate: visitGuest.birthDate,
        motherName: visitGuest.motherName,
        address: visitAddress
          ? `${visitAddress.country}, ${visitAddress.zipCode}, ${visitAddress.city}, ${visitAddress.streetAddress}`
          : null,
        identifierCardType: visitGuest.identifierCardType,
        identifierCardNumber: visitGuest.identifierCardNumber,
        company: !visitGuest.company
          ? null
          : {
              name: visitGuest.company.name,
              registrationNumber: visitGuest.company.registrationNumber,
              address: visitGuest.company.address
                ? `${visitGuest.company.address.country}, ${visitGuest.company.address.zipCode}, ${visitGuest.company.address.city}, ${visitGuest.company.address.streetAddress}`
                : null
            },
        imageUrl: visitGuest.imageUrl,
        signatureImageUrl: visitGuest.signatureImageUrl,
        actualEntry: visitGuest.actualEntry,
        actualExit: visitGuest.actualExit,
        receptionistName: visitGuest.receptionist
          ? `${visitGuest.receptionist.firstName} ${visitGuest.receptionist.lastName}`
          : null,
        guestCardNumber: visitGuest.guestCard ? visitGuest.guestCard.identifierNumber : null,
        participationStatus: visitGuest.participationStatus
      },
      consentFormVersionsToAccept,
      consentFormVersionsAccepted,
      companyRegisterConfig
    }

    return visitDetails
  }
}

export default VisitService
