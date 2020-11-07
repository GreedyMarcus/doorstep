import OfficeBuilding from '../../models/OfficeBuilding'
import ConsentForm from '../../models/ConsentForm'
import ConsentFormVersion from '../../models/ConsentFormVersion'
import ConsentFormRepositoryInterface from './ConsentFormRepositoryInterface'
import { injectable } from 'inversify'
import { EntityRepository, getManager, getRepository, Repository } from 'typeorm'
import { ConsentFormType } from '../../data/enums/ConsentFormType'

@injectable()
@EntityRepository(ConsentForm)
class ConsentFormRepository extends Repository<ConsentForm> implements ConsentFormRepositoryInterface {
  public findConsentFormsByBuildingId(buildingId: number): Promise<ConsentForm[]> {
    return getRepository(ConsentForm)
      .createQueryBuilder('consentForm')
      .where('consentForm.officeBuilding = :buildingId', { buildingId })
      .getMany()
  }

  public async createGlobalConsentForm(buildingId: number, title: string, content: string): Promise<ConsentForm> {
    const building = await getRepository(OfficeBuilding)
      .createQueryBuilder('building')
      .where('building.id = :buildingId', { buildingId })
      .getOne()

    // Force rollback if building does not exist
    if (!building) throw Error

    return getManager().transaction(async transactionEntityManager => {
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

  public findConsentFormById(formId: number): Promise<ConsentForm> {
    return getRepository(ConsentForm)
      .createQueryBuilder('consentForm')
      .leftJoinAndSelect('consentForm.activeVersion', 'activeVersion')
      .leftJoinAndSelect('consentForm.versions', 'versions')
      .where('consentForm.id = :formId', { formId })
      .getOne()
  }

  public findConsentFormVersionById(versionId: number): Promise<ConsentFormVersion> {
    return getRepository(ConsentFormVersion)
      .createQueryBuilder('consentFormVersion')
      .where('consentFormVersion.id = :versionId', { versionId })
      .getOne()
  }

  public async createConsentFormVersion(formId: number, content: string, versionNumber: number): Promise<ConsentFormVersion> {
    const consentForm = await getRepository(ConsentForm)
      .createQueryBuilder('consentForm')
      .where('consentForm.id = :formId', { formId })
      .getOne()

    const newConsentFormVersion = new ConsentFormVersion()
    newConsentFormVersion.content = content
    newConsentFormVersion.versionNumber = versionNumber
    newConsentFormVersion.consentForm = consentForm

    return getRepository(ConsentFormVersion).save(newConsentFormVersion)
  }

  public async updateConsentFormVersion(versionId: number, content: string): Promise<ConsentFormVersion> {
    const consentFormVersion = await this.findConsentFormVersionById(versionId)

    consentFormVersion.content = content
    return getRepository(ConsentFormVersion).save(consentFormVersion)
  }

  public async updateActiveConsentFormVersion(formId: number, versionId: number): Promise<void> {
    const consentForm = await this.findConsentFormById(formId)
    const consentFormVersion = await this.findConsentFormVersionById(versionId)

    consentForm.activeVersion = consentFormVersion
    await getRepository(ConsentForm).save(consentForm)
  }
}

export default ConsentFormRepository
