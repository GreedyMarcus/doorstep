import React, { FormEvent } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import PasswordField from '../../components/shared/PasswordField'
import Button from '@material-ui/core/Button'
import useStyles from './useStyles'
import useInput from '../../components/hooks/useInput'
import REGEXP from '../../utils/regexp'
import { UserRegister } from '../../data/types/User'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../store'
import { addNotification } from '../../store/action'

interface RegisterAdminProps {
  visible: boolean
  onNextClick: (adminData: UserRegister) => void
}

/**
 * Sub-component of the multi-step registration form.
 * It handles the data belongs to the admin user, including validation.
 */
const RegisterAdmin: React.FC<RegisterAdminProps> = ({ visible, onNextClick }) => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [email, bindEmail] = useInput({ initialValue: '', required: true, validator: REGEXP.EMAIL })
  const [password, bindPassword] = useInput({ initialValue: '', required: true, validator: REGEXP.PASSWORD })
  const [firstName, bindFirstName] = useInput({ initialValue: '', required: true })
  const [lastName, bindLastName] = useInput({ initialValue: '', required: true })

  /**
   * Submits the admin data to the register form.
   */
  const handleNextClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isAdminDataValid = [email, password, firstName, lastName].every(param => param.valid)
    if (!isAdminDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalid.adminData') }))
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

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <form onSubmit={handleNextClick} noValidate autoComplete="off">
        <Typography className={classes.title} component="h1">
          {t('page.register.adminDetails')}
        </Typography>

        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <TextField {...bindEmail} label={t('common.email')} variant="outlined" fullWidth />
          </Grid>
          <Grid item sm={6} xs={12}>
            <PasswordField {...bindPassword} label={t('common.password')} variant="outlined" fullWidth />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField {...bindFirstName} label={t('common.firstName')} variant="outlined" fullWidth />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField {...bindLastName} label={t('common.lastName')} variant="outlined" fullWidth />
          </Grid>
        </Grid>

        <Grid className={classes.buttons} container justify="flex-end">
          <Button className={classes.button} variant="contained" color="primary" type="submit">
            {t('action.next')}
          </Button>
        </Grid>
      </form>
    </div>
  )
}

export default RegisterAdmin
