import Visit from '../../models/Visit'
import User from '../../models/User'
import Guest from '../../models/Guest'
import Company from '../../models/Company'
import UserRole from '../../models/UserRole'
import ConsentForm from '../../models/ConsentForm'
import Address from '../../models/Address'
import VisitRepositoryInterface from './VisitRepositoryInterface'
import { injectable } from 'inversify'
import { EntityRepository, getManager, getRepository, Repository } from 'typeorm'
import { GuestUpdateByUserDTO } from '../../data/dtos/VisitDTO'
import { GuestParticipationStatus } from '../../data/enums/GuestParticipationStatus'
import { UserRoleType } from '../../data/enums/UserRoleType'
import { IdentifierCardType } from '../../data/enums/IdentifierCardType'

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
      .leftJoinAndSelect('company.officeBuilding', 'companyBuilding')
      .leftJoinAndSelect('companyBuilding.address', 'buildingAddress')
      .leftJoinAndSelect('guests.user', 'user')
      .leftJoinAndSelect('guests.address', 'guestAddress')
      .leftJoinAndSelect('guests.receptionist', 'receptionist')
      .leftJoinAndSelect('guests.guestCard', 'guestCard')
      .leftJoinAndSelect('guests.company', 'guestCompany')
      .leftJoinAndSelect('guests.consentFormVersions', 'guestConsentFormVersions')
      .leftJoinAndSelect('guestCompany.address', 'guestCompanyAddress')
      .leftJoinAndSelect('consentFormVersions.consentForm', 'consentForm')
      .leftJoinAndSelect('guestConsentFormVersions.consentForm', 'guestConsentForm')
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

  public findVisitsByGuestUserId(userId: number): Promise<Visit[]> {
    return getRepository(Visit)
      .createQueryBuilder('visit')
      .leftJoinAndSelect('visit.businessHost', 'businessHost')
      .leftJoinAndSelect('visit.company', 'company')
      .leftJoinAndSelect('company.officeBuilding', 'companyBuilding')
      .leftJoinAndSelect('companyBuilding.address', 'buildingAddress')
      .leftJoinAndSelect('visit.guests', 'guests')
      .leftJoinAndSelect('guests.user', 'guestUser')
      .where('guestUser.id = :userId', { userId })
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

  public async updateVisitGuest(userId: number, visit: Partial<Visit>, data: GuestUpdateByUserDTO): Promise<void> {
    // Check if guest address data is provided
    let guestAddress
    if (data.address) {
      // Check if address already exists
      guestAddress = await getRepository(Address)
        .createQueryBuilder('address')
        .where('address.country = :country', { country: data.address.country })
        .andWhere('address.zipCode = :zipCode', { zipCode: data.address.zipCode })
        .andWhere('address.city = :city', { city: data.address.city })
        .andWhere('address.streetAddress = :streetAddress', { streetAddress: data.address.streetAddress })
        .getOne()
    }

    // Check if guest company address is provided
    let companyAddress
    if (data.company) {
      // Check if address already exists
      companyAddress = await getRepository(Address)
        .createQueryBuilder('address')
        .where('address.country = :country', { country: data.company.address.country })
        .andWhere('address.zipCode = :zipCode', { zipCode: data.company.address.zipCode })
        .andWhere('address.city = :city', { city: data.company.address.city })
        .andWhere('address.streetAddress = :streetAddress', { streetAddress: data.company.address.streetAddress })
        .getOne()
    }

    await getManager().transaction(async transactionEntityManager => {
      const visitGuest = visit.guests.filter(guest => guest.user.id === userId)[0]

      visitGuest.nationality = data.nationality
      visitGuest.phoneNumber = data.phoneNumber
      visitGuest.birthplace = data.birthplace
      visitGuest.birthDate = data.birthDate
      visitGuest.motherName = data.motherName
      visitGuest.identifierCardType = IdentifierCardType[data.identifierCardType.toUpperCase()]
      visitGuest.identifierCardNumber = data.identifierCardNumber
      visitGuest.imageUrl = data.imageUrl
      visitGuest.signatureImageUrl = data.signatureImageUrl

      if (data.address) {
        // If address not exists create one for the building
        if (!guestAddress) {
          const newAddress = new Address()
          newAddress.country = data.address.country
          newAddress.zipCode = data.address.zipCode
          newAddress.city = data.address.city
          newAddress.streetAddress = data.address.streetAddress

          guestAddress = await transactionEntityManager.getRepository(Address).save(newAddress)
        }

        visitGuest.address = guestAddress
      }

      let newCompanyAddress
      if (data.company) {
        // Check if guest has a registered company alreay
        if (visitGuest.company) {
          visitGuest.company.name = data.company.name
          visitGuest.company.registrationNumber = data.company.registrationNumber

          if (!companyAddress) {
            newCompanyAddress = new Address()
            newCompanyAddress.country = data.address.country
            newCompanyAddress.zipCode = data.address.zipCode
            newCompanyAddress.city = data.address.city
            newCompanyAddress.streetAddress = data.address.streetAddress

            companyAddress = await transactionEntityManager.getRepository(Address).save(newCompanyAddress)
          }

          visitGuest.company.address = companyAddress
        } else {
          const newGuestCompany = new Company()
          newGuestCompany.name = data.company.name
          newGuestCompany.registrationNumber = data.company.registrationNumber

          if (!companyAddress) {
            newCompanyAddress = new Address()
            newCompanyAddress.country = data.address.country
            newCompanyAddress.zipCode = data.address.zipCode
            newCompanyAddress.city = data.address.city
            newCompanyAddress.streetAddress = data.address.streetAddress

            companyAddress = await transactionEntityManager.getRepository(Address).save(newCompanyAddress)
          }

          newGuestCompany.address = companyAddress
          const createdGuestCompany = await transactionEntityManager.getRepository(Company).save(newGuestCompany)

          visitGuest.company = createdGuestCompany
        }
      }

      visitGuest.participationStatus = GuestParticipationStatus.CONFIRMED
      visitGuest.consentFormVersions = visit.consentFormVersions.filter(version => {
        return data.consentFormVersionsAccepted.includes(version.id)
      })

      await transactionEntityManager.getRepository(Guest).save(visitGuest)
    })
  }
}

export default VisitRepository
