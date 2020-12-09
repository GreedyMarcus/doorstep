import useInput from '../../components/hooks/useInput'
import REGEXP from '../../utils/regexp'
import { FormEvent } from 'react'
import { useAppDispatch } from '../../store'
import { useTranslation } from 'react-i18next'
import { resetUserPassword } from '../../store/user'
import { addNotification } from '../../store/action'

interface ResetPasswordHookProps {
  token: string
}

/**
 * Custom React hook that spearates the Reset Password page logic.
 */
const useResetPassword = ({ token }: ResetPasswordHookProps) => {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [password, bindPassword] = useInput({ required: true, validator: REGEXP.PASSWORD })

  /**
   * Handles the password reset request.
   */
  const handlePasswordReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!password.valid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalid.password') }))
      return
    }

    dispatch(resetUserPassword(token, password.value))
  }

  return [bindPassword, handlePasswordReset] as const
}

export default useResetPassword
