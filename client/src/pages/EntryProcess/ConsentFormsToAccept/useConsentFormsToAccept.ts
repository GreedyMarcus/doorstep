import { useState, FormEvent } from 'react'
import { ConsentFormVersionDetails } from '../../../data/types/ConsentForm'
import { useAppDispatch } from '../../../store'
import { useTranslation } from 'react-i18next'
import { addNotification } from '../../../store/action'

interface ConsentFormsToAcceptHookProps {
  forms: ConsentFormVersionDetails[] | undefined
  acceptedForms: number[] | undefined
  onNextClick: (acceptedFormIds: number[]) => void
}

/**
 * Custom React hook that spearates the Consent forms to accept component logic.
 */
const useConsentFormsToAccept = ({ forms, acceptedForms, onNextClick }: ConsentFormsToAcceptHookProps) => {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [checked, setChecked] = useState(acceptedForms ?? ([] as number[]))

  const toggle = (value: number) => {
    const newChecked = [...checked]
    const currentIndex = checked.indexOf(value)

    currentIndex === -1 ? newChecked.push(value) : newChecked.splice(currentIndex, 1)
    setChecked(newChecked)
  }

  /**
   * Handles the next click request.
   */
  const handleNextClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (forms?.length !== checked.length) {
      dispatch(addNotification({ type: 'warning', message: t('notification.consentFormsAcceptance.warning') }))
      return
    }

    onNextClick(checked)
  }

  return [checked, toggle, handleNextClick] as const
}

export default useConsentFormsToAccept
