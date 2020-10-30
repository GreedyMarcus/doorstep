import ConsentForm from '../../models/ConsentForm'

interface ConsentFormRepositoryInterface {
  findConsentFormsByBuildingAdminId(adminId: number): Promise<ConsentForm[]>
}

export default ConsentFormRepositoryInterface
