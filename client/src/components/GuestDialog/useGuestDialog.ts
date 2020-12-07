import useInput from '../../components/hooks/useInput'
import REGEXP from '../../utils/regexp'
import { useState } from 'react'
import { GuestUserRegister } from '../../data/types/User'
import { useAppDispatch } from '../../store'
import { useTranslation } from 'react-i18next'
import { addNotification } from '../../store/action'

interface GuestDialogHookProps {
  onSave: (guest: GuestUserRegister) => void
  onClose: () => void
}

/**
 * Custom React hook that spearates the Guest dialog component logic.
 */
const useGuestDialog = ({ onSave, onClose }: GuestDialogHookProps) => {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [isOpen, setOpen] = useState(true)

  const [email, bindEmail] = useInput({ required: true, validator: REGEXP.EMAIL })
  const [firstName, bindFirstName] = useInput({ required: true })
  const [lastName, bindLastName] = useInput({ required: true })

  /**
   * Closes the dialog.
   */
  const handleClose = () => {
    // This method provides smooth exit animation for the component
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  /**
   * Saves the new guest.
   */
  const handleSave = () => {
    const isGuestDataValid = [firstName, lastName, email].every(param => param.valid)
    if (!isGuestDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalid.guest') }))
      return
    }

    const guestData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value
    }

    onSave(guestData)
    handleClose()
  }

  return [isOpen, bindEmail, bindFirstName, bindLastName, handleSave, handleClose] as const
}

export default useGuestDialog
