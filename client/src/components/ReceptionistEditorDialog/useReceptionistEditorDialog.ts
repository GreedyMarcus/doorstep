import useInput from '../../components/hooks/useInput'
import REGEXP from '../../utils/regexp'
import { useState } from 'react'
import { EmployeeInfo } from '../../data/types/Company'
import { useAppDispatch } from '../../store'
import { useTranslation } from 'react-i18next'
import { addNotification } from '../../store/action'
import { createReceptionist, updateReceptionist } from '../../store/building'

interface ReceptionistEditorDialogHookProps {
  receptionist?: EmployeeInfo
  isEditing?: boolean
  onClose: () => void
}

/**
 * Custom React hook that spearates the Receptionist editor dialog component logic.
 */
const useReceptionistEditorDialog = ({ receptionist, isEditing, onClose }: ReceptionistEditorDialogHookProps) => {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [isOpen, setOpen] = useState(true)

  const [firstName, bindFirstName] = useInput({ initialValue: receptionist?.firstName, required: true })
  const [lastName, bindLastName] = useInput({ initialValue: receptionist?.lastName, required: true })
  const [email, bindEmail] = useInput({ initialValue: receptionist?.email, required: true, validator: REGEXP.EMAIL })
  const [password, bindPassword] = useInput({ required: true, validator: REGEXP.PASSWORD })

  /**
   * Closes the dialog.
   */
  const handleClose = () => {
    // This method provides smooth exit animation for the component
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  /**
   * Saves the new or modified receptionist.
   */
  const handleSave = () => {
    const isReceptionistDataValid = [firstName, lastName, email].every(param => param.valid)
    if (!isReceptionistDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalid.receptionist') }))
      return
    }

    if (isEditing) {
      const modifiedReceptionistData = {
        id: receptionist?.id || -1,
        firstName: firstName.value,
        lastName: lastName.value
      }

      dispatch(updateReceptionist(modifiedReceptionistData))
      handleClose()
      return
    }

    const receptionistData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value
    }

    dispatch(createReceptionist(receptionistData))
    handleClose()
  }

  return [isOpen, bindFirstName, bindLastName, bindEmail, bindPassword, handleSave, handleClose] as const
}

export default useReceptionistEditorDialog
