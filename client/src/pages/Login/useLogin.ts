import useInput from '../../components/hooks/useInput'
import REGEXP from '../../utils/regexp'
import { FormEvent } from 'react'
import { useHistory } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { useTranslation } from 'react-i18next'
import { loginUser } from '../../store/user'
import { addNotification } from '../../store/action'

/**
 * Custom React hook that spearates the Login page logic.
 */
const useLogin = () => {
  const history = useHistory()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [email, bindEmail] = useInput({ required: true, validator: REGEXP.EMAIL })
  const [password, bindPassword] = useInput({})

  /**
   * Handles the login request.
   */
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isLoginDataValid = [email, password].every(param => param.valid)
    if (!isLoginDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalid.login') }))
      return
    }

    const userData = {
      email: email.value,
      password: password.value
    }

    dispatch(loginUser(userData))
    history.push('/')
  }

  return [bindEmail, bindPassword, handleLogin] as const
}

export default useLogin
