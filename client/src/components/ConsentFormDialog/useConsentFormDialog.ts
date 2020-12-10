import useInput from '../../components/hooks/useInput'
import { useState } from 'react'
import { useAppDispatch } from '../../store'
import { useTranslation } from 'react-i18next'
import { addNotification } from '../../store/action'
import { createConsentForm } from '../../store/consentForm'

interface ConsentFormDialogHookProps {
  onClose: () => void
}

/**
 * Custom React hook that spearates the Consent form dialog component logic.
 */
const useConsentFormDialog = ({ onClose }: ConsentFormDialogHookProps) => {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [isOpen, setOpen] = useState(true)

  const [title, bindTitle] = useInput({ required: true })
  const [content, bindContent, changeContent] = useInput({ required: true })

  /**
   * Closes the dialog.
   */
  const handleClose = () => {
    // This method provides smooth exit animation for the component.
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  /**
   * Saves the new consent form.
   */
  const handleSave = () => {
    const isConsentFormDataValid = [title, content].every(input => input.valid)
    if (!isConsentFormDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalid.consentForm') }))
      return
    }

    const consentFormData = {
      title: title.value,
      content: content.value
    }

    dispatch(createConsentForm(consentFormData))
    handleClose()
  }

  return [isOpen, bindTitle, bindContent, changeContent, handleSave, handleClose] as const
}

export default useConsentFormDialog
