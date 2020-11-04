import User from '../../models/User'
import OfficeBuilding from '../../models/OfficeBuilding'
import ConsentForm from '../../models/ConsentForm'
import ConsentFormVersion from '../../models/ConsentFormVersion'
import ConsentFormRepositoryInterface from './ConsentFormRepositoryInterface'
import { EntityRepository, getManager, getRepository, Repository } from 'typeorm'
import { injectable } from 'inversify'
import { ConsentFormType } from '../../data/enums/ConsentFormType'

@injectable()
@EntityRepository(ConsentForm)
class ConsentFormRepository extends Repository<ConsentForm> implements ConsentFormRepositoryInterface {
  public findConsentFormById(consentFormId: number, consentFormType: ConsentFormType): Promise<ConsentForm> {
    return getRepository(ConsentForm)
      .createQueryBuilder('consentForm')
      .leftJoinAndSelect('consentForm.activeVersion', 'activeVersion')
      .leftJoinAndSelect('consentForm.versions', 'versions')
      .where('consentForm.id = :consentFormId', { consentFormId })
      .andWhere('consentForm.type = :consentFormType', { consentFormType })
      .getOne()
  }

  public findConsentFormsByBuildingAdminId(adminId: number): Promise<ConsentForm[]> {
    return getRepository(ConsentForm)
      .createQueryBuilder('consentForm')
      .leftJoinAndSelect(OfficeBuilding, 'building', 'building.id = consentForm.officeBuilding')
      .leftJoinAndSelect(User, 'user', 'building.admin = user.id')
      .where('user.id = :adminId', { adminId })
      .getMany()
  }

  public createGlobalConsentForm(title: string, content: string, adminId: number): Promise<ConsentForm> {
    return getManager().transaction(async transactionEntityManager => {
      // Get building by admin id
      const building = await transactionEntityManager.getRepository(OfficeBuilding).findOne({ where: { admin: { id: adminId } } })
      if (!building) throw Error // Force the transaction rollback

      // Save global consent form
      const newGlobalConsentForm = new ConsentForm()
      newGlobalConsentForm.title = title
      newGlobalConsentForm.type = ConsentFormType.GLOBAL
      newGlobalConsentForm.officeBuilding = building
      const createdGlobalConsentForm = await transactionEntityManager.getRepository(ConsentForm).save(newGlobalConsentForm)

      // Save first global consent form version
      const newGlobalConsentFormVersion = new ConsentFormVersion()
      newGlobalConsentFormVersion.content = content
      newGlobalConsentFormVersion.versionNumber = 1
      newGlobalConsentFormVersion.consentForm = createdGlobalConsentForm
      await transactionEntityManager.getRepository(ConsentFormVersion).save(newGlobalConsentFormVersion)

      return createdGlobalConsentForm
    })
  }
}

export default ConsentFormRepository
