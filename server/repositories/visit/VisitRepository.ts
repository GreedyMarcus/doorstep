import Visit from '../../models/Visit'
import User from '../../models/User'
import Guest from '../../models/Guest'
import Company from '../../models/Company'
import UserRole from '../../models/UserRole'
import ConsentForm from '../../models/ConsentForm'
import VisitRepositoryInterface from './VisitRepositoryInterface'
import { injectable } from 'inversify'
import { EntityRepository, getManager, getRepository, Repository } from 'typeorm'
import { GuestParticipationStatus } from '../../data/enums/GuestParticipationStatus'
import { UserRoleType } from '../../data/enums/UserRoleType'

@injectable()
@EntityRepository(Visit)
class VisitRepository extends Repository<Visit> implements VisitRepositoryInterface {
  public findVisitById(visitId: number): Promise<Visit> {
    return getRepository(Visit)
      .createQueryBuilder('visit')
      .leftJoinAndSelect('visit.businessHost', 'businessHost')
      .leftJoinAndSelect('visit.company', 'company')
      .leftJoinAndSelect('visit.guests', 'guests')
      .leftJoinAndSelect('visit.consentFormVersions', 'consentFormVersions')
      .leftJoinAndSelect('guests.user', 'user')
      .leftJoinAndSelect('guests.receptionist', 'receptionist')
      .leftJoinAndSelect('guests.guestCard', 'guestCard')
      .leftJoinAndSelect('guests.company', 'guestCompany')
      .leftJoinAndSelect('guestCompany.address', 'guestCompanyAddress')
      .leftJoinAndSelect('consentFormVersions.consentForm', 'consentForm')
      .where('visit.id = :visitId', { visitId })
      .getOne()
  }

  public findVisitsByCompanyId(companyId: number): Promise<Visit[]> {
    return getRepository(Visit)
      .createQueryBuilder('visit')
      .leftJoinAndSelect('visit.businessHost', 'businessHost')
      .where('visit.company = :companyId', { companyId })
      .andWhere('visit.plannedEntry < NOW()')
      .getMany()
  }

  public findPlannedVisitsByHostId(hostId: number): Promise<Visit[]> {
    return getRepository(Visit)
      .createQueryBuilder('visit')
      .leftJoinAndSelect('visit.businessHost', 'businessHost')
      .where('businessHost.id = :hostId', { hostId })
      .andWhere('visit.plannedEntry >= NOW()')
      .getMany()
  }

  public async createVisit(companyId: number, hostId: number, data: Partial<Visit>, guests: Partial<User>[]): Promise<Visit> {
    const company = await getRepository(Company)
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.officeBuilding', 'officeBuilding')
      .where('company.id = :companyId', { companyId })
      .getOne()

    // Force rollback if company does not exist
    if (!company) throw Error

    const businessHost = await getRepository(User).createQueryBuilder('user').where('user.id = :hostId', { hostId }).getOne()

    // Force rollback if business host does not exist
    if (!businessHost) throw Error

    const guestRole = await getRepository(UserRole)
      .createQueryBuilder('role')
      .where('role.name = :roleName', { roleName: UserRoleType.GUEST })
      .getOne()

    // Force rollback if role does not exist
    if (!guestRole) throw Error

    const consentFormsToAccept = await getRepository(ConsentForm)
      .createQueryBuilder('consentForm')
      .leftJoinAndSelect('consentForm.activeVersion', 'activeVersion')
      .where('consentForm.company = :companyId', { companyId: company.id })
      .orWhere('consentForm.officeBuilding = :buildingId', { buildingId: company.officeBuilding.id })
      .andWhere('consentForm.activeVersion IS NOT NULL')
      .getMany()

    return getManager().transaction(async transactionEntityManager => {
      const newVisit = new Visit()
      newVisit.plannedEntry = data.plannedEntry
      newVisit.purpose = data.purpose
      newVisit.room = data.room
      newVisit.company = company
      newVisit.businessHost = businessHost

      const createdGuests: Guest[] = []

      for (const { email, password, firstName, lastName } of guests) {
        const newGuest = new Guest()

        // Check if there is any guest that exists with the provided email
        const foundGuestUser = await getRepository(User)
          .createQueryBuilder('user')
          .leftJoinAndSelect('user.role', 'role')
          .where('user.email = :email', { email })
          .getOne()

        if (!foundGuestUser) {
          const newGuestUser = new User()
          newGuestUser.email = email
          newGuestUser.password = password
          newGuestUser.firstName = firstName
          newGuestUser.lastName = lastName
          newGuestUser.role = guestRole

          const createdGuestUser = await transactionEntityManager.getRepository(User).save(newGuestUser)
          newGuest.user = createdGuestUser
        } else {
          const foundGuest = await getRepository(Guest)
            .createQueryBuilder('guest')
            .leftJoinAndSelect('guest.address', 'address')
            .where('guest.user = :userId', { userId: foundGuestUser.id })
            .orderBy('guest.createdAt', 'DESC')
            .getOne()

          newGuest.nationality = foundGuest.nationality
          newGuest.phoneNumber = foundGuest.phoneNumber
          newGuest.birthplace = foundGuest.birthplace
          newGuest.birthDate = foundGuest.birthDate
          newGuest.motherName = foundGuest.motherName
          newGuest.address = foundGuest.address
          newGuest.imageUrl = foundGuest.imageUrl
          newGuest.identifierCardType = foundGuest.identifierCardType
          newGuest.identifierCardNumber = foundGuest.identifierCardNumber
          newGuest.signatureImageUrl = foundGuest.signatureImageUrl
          newGuest.user = foundGuestUser
        }

        newGuest.participationStatus = GuestParticipationStatus.INVITED

        const createdGuest = await transactionEntityManager.getRepository(Guest).save(newGuest)
        createdGuests.push(createdGuest)
      }

      newVisit.guests = createdGuests
      newVisit.consentFormVersions = consentFormsToAccept.map(form => form.activeVersion)
      const createdVisit = await transactionEntityManager.getRepository(Visit).save(newVisit)

      return createdVisit
    })
  }
}

export default VisitRepository
