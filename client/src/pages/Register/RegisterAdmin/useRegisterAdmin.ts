import useInput from '../../../components/hooks/useInput'
import REGEXP from '../../../utils/regexp'
import { FormEvent } from 'react'
import { UserRegister } from '../../../data/types/User'
import { useAppDispatch } from '../../../store'
import { useTranslation } from 'react-i18next'
import { addNotification } from '../../../store/action'

interface RegisterAdminHookProps {
  onNextClick: (adminData: UserRegister) => void
}

/**
 * Custom React hook that spearates the Register Admin component logic.
 */
const useRegisterAdmin = ({ onNextClick }: RegisterAdminHookProps) => {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [email, bindEmail] = useInput({ required: true, validator: REGEXP.EMAIL })
  const [password, bindPassword] = useInput({ required: true, validator: REGEXP.PASSWORD })
  const [firstName, bindFirstName] = useInput({ required: true })
  const [lastName, bindLastName] = useInput({ required: true })

  /**
   * Handles the next click request.
   */
  const handleNextClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isAdminDataValid = [email, password, firstName, lastName].every(param => param.valid)
    if (!isAdminDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalid.admin') }))
      return
    }

    const adminData = {
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value
    }

    onNextClick(adminData)
  }

  return [bindEmail, bindPassword, bindFirstName, bindLastName, handleNextClick] as const
}

export default useRegisterAdmin
