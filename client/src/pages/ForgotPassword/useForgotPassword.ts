import useInput from '../../components/hooks/useInput'
import REGEXP from '../../utils/regexp'
import { FormEvent } from 'react'
import { useHistory } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { useTranslation } from 'react-i18next'
import { sendForgotPassword } from '../../store/user'
import { addNotification } from '../../store/action'

/**
 * Custom React hook that spearates the Forgot Password page logic.
 */
const useForgotPassword = () => {
  const history = useHistory()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [email, bindEmail] = useInput({ required: true, validator: REGEXP.EMAIL })

  /**
   * Handles the password reset request.
   */
  const handlePasswordReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.valid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalid.email') }))
      return
    }

    await dispatch(sendForgotPassword(email.value))
    history.push('/login')
  }

  return [bindEmail, handlePasswordReset] as const
}

export default useForgotPassword
