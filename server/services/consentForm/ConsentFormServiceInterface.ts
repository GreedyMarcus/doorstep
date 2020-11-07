import { ConsentFormDetailsDTO, ConsentFormVersionInfoDTO } from '../../data/dtos/ConsentFormDTO'

interface ConsentFormServiceInterface {
  getConsentFormById(formId: number): Promise<ConsentFormDetailsDTO>
  createConsentFormVersion(formId: number, content: string): Promise<ConsentFormVersionInfoDTO>
  updateConsentFormVersion(formId: number, versionId: number, content: string): Promise<ConsentFormVersionInfoDTO>
  activateConsentFormVersion(formId: number, versionId: number): Promise<void>
}

export default ConsentFormServiceInterface
