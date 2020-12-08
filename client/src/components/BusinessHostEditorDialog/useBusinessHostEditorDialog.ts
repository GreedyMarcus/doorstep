import useInput from '../../components/hooks/useInput'
import REGEXP from '../../utils/regexp'
import { useState } from 'react'
import { EmployeeInfo } from '../../data/types/Company'
import { useAppDispatch } from '../../store'
import { useTranslation } from 'react-i18next'
import { addNotification } from '../../store/action'
import { createBusinessHost, updateBusinessHost } from '../../store/company'

interface BusinessHostEditorDialogHookProps {
  businessHost?: EmployeeInfo
  isEditing?: boolean
  onClose: () => void
}

/**
 * Custom React hook that spearates the Business host editor dialog component logic.
 */
const useBusinessHostEditorDialog = ({ businessHost, isEditing, onClose }: BusinessHostEditorDialogHookProps) => {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [isOpen, setOpen] = useState(true)

  const [firstName, bindFirstName] = useInput({ initialValue: businessHost?.firstName, required: true })
  const [lastName, bindLastName] = useInput({ initialValue: businessHost?.lastName, required: true })
  const [email, bindEmail] = useInput({ initialValue: businessHost?.email, required: true, validator: REGEXP.EMAIL })
  const [password, bindPassword] = useInput({ required: true, validator: REGEXP.PASSWORD })

  /**
   * Closes the dialog.
   */
  const handleClose = () => {
    // This method provides smooth exit animation for the component.
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  /**
   * Saves the new or modified business host.
   */
  const handleSave = () => {
    const isBusinessHostDataValid = [firstName, lastName, email].every(param => param.valid)
    if (!isBusinessHostDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalid.businessHost') }))
      return
    }

    if (isEditing) {
      const modifiedBusinessHostData = {
        id: businessHost?.id || -1,
        firstName: firstName.value,
        lastName: lastName.value
      }

      dispatch(updateBusinessHost(modifiedBusinessHostData))
      handleClose()
      return
    }

    const businessHostData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value
    }

    dispatch(createBusinessHost(businessHostData))
    handleClose()
  }

  return [isOpen, bindFirstName, bindLastName, bindEmail, bindPassword, handleSave, handleClose] as const
}

export default useBusinessHostEditorDialog
