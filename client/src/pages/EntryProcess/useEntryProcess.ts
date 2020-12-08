import { useState } from 'react'
import { GuestBasicFormData } from '../../data/types/Visit'
import { CompanyShortUpdate } from '../../data/types/Company'
import { GuestUpdateByUser } from '../../data/types/Visit'
import { useHistory } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { updateGuestByReceptionist } from '../../store/visit'

interface EntryProcessHookProps {
  visitId: number
  guestId: number
}

/**
 * Custom React hook that spearates the Entry process page logic.
 */
const useEntryProcess = ({ visitId, guestId }: EntryProcessHookProps) => {
  const history = useHistory()
  const dispatch = useAppDispatch()

  const [basicData, setBasicData] = useState({} as GuestBasicFormData)
  const [companyDetails, setCompanyDetails] = useState({} as CompanyShortUpdate | null)
  const [acceptedFormIds, setAcceptedFormIds] = useState([] as number[])
  const [activeStep, setActiveStep] = useState(0)

  /**
   * Handles the next click event of the basic data sub-component.
   */
  const handleBasicDataNextClick = (basicData: GuestBasicFormData) => {
    setBasicData(basicData)
    setActiveStep(activeStep + 1)
  }

  /**
   * Handles the next click event of the company details sub-component.
   */
  const handleCompanyDetailsNextClick = (companyData: CompanyShortUpdate | null) => {
    setCompanyDetails(companyData)
    setActiveStep(activeStep + 1)
  }

  /**
   * Handles the next click event of the consent forms to accept sub-component.
   */
  const handleConsentFormsToAcceptNextClick = (acceptedForms: number[]) => {
    setAcceptedFormIds(acceptedForms)
    setActiveStep(activeStep + 1)
  }

  /**
   * Saves the result of the entry process.
   */
  const handleEntryProcessFinish = async (signature: string) => {
    const entryProcessData: GuestUpdateByUser = {
      ...basicData,
      company: companyDetails,
      imageUrl: null,
      signature: JSON.stringify(signature),
      consentFormVersionsAccepted: acceptedFormIds
    }

    await dispatch(updateGuestByReceptionist(visitId, guestId, entryProcessData))
    history.push(`/invitations/${visitId}/guests/${guestId}`)
  }

  /**
   * Handles the back click event for sub-components.
   */
  const handleBackClick = () => setActiveStep(activeStep - 1)

  return [
    activeStep,
    handleBasicDataNextClick,
    handleCompanyDetailsNextClick,
    handleConsentFormsToAcceptNextClick,
    handleEntryProcessFinish,
    handleBackClick
  ] as const
}

export default useEntryProcess
