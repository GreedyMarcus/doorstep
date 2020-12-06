import useInput from '../../components/hooks/useInput'
import REGEXP from '../../utils/regexp'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { useTranslation } from 'react-i18next'
import { addNotification } from '../../store/action'
import { activeUserSelector, updateUserCredentials } from '../../store/user'

interface UserProfileDialogHookProps {
  onClose: () => void
}

/**
 * Custom React hook that spearates the User profile dialog component logic.
 */
const useUserProfileDialog = ({ onClose }: UserProfileDialogHookProps) => {
  const dispatch = useAppDispatch()
  const user = useSelector(activeUserSelector)
  const [t] = useTranslation()

  const [isOpen, setOpen] = useState(true)

  const [firstName, bindFirstName] = useInput({ initialValue: user?.firstName, required: true })
  const [lastName, bindLastName] = useInput({ initialValue: user?.lastName, required: true })
  const [password, bindPassword] = useInput({ validator: REGEXP.PASSWORD })

  /**
   * Closes the dialog.
   */
  const handleClose = () => {
    // This method provides smooth exit animation for the component
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  /**
   * Saves the modified user credentials.
   */
  const handleSave = () => {
    const isUserDataValid = [firstName, lastName, password].every(param => param.valid)
    if (!isUserDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalid.user') }))
      return
    }

    const userCredentials = {
      firstName: firstName.value,
      lastName: lastName.value,
      password: !!password.value ? password.value : undefined
    }

    dispatch(updateUserCredentials(userCredentials))
    handleClose()
  }

  return [isOpen, user, bindFirstName, bindLastName, bindPassword, handleSave, handleClose] as const
}

export default useUserProfileDialog
