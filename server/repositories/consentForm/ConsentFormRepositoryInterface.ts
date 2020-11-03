import ConsentForm from '../../models/ConsentForm'

interface ConsentFormRepositoryInterface {
  findConsentFormsByBuildingAdminId(adminId: number): Promise<ConsentForm[]>
  createGlobalConsentForm(title: string, content: string, adminId: number): Promise<ConsentForm>
}

export default ConsentFormRepositoryInterface
