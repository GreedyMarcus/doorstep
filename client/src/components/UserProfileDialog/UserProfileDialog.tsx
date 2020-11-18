import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import DefaultDialogActions from '../shared/DefaultDialogActions'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import useInput from '../../components/shared/useInput'
import REGEXP from '../../utils/regexp'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { addNotification } from '../../store/action'
import { activeUserSelector, updateUserCredentials } from '../../store/user'
import { UserCredentials } from '../../data/types/User'

type Props = {
  onClose: () => void
}

/**
 * Custom dialog component to edit user credentials.
 */
const UserProfileDialog: React.FC<Props> = ({ onClose }) => {
  const classes = useStyles()
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const dispatch = useAppDispatch()
  const user = useSelector(activeUserSelector)
  const [isOpen, setOpen] = useState(true)
  const [t] = useTranslation()

  const [firstName, bindFirstName] = useInput(user?.firstName || '', true)
  const [lastName, bindLastName] = useInput(user?.lastName || '', true)
  const [password, bindPassword] = useInput('', false, REGEXP.PASSWORD)

  const handleClose = () => {
    // This method provides smooth exit animation for the component
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  const handleSave = () => {
    const isUserDataValid = [firstName, lastName, password].every(param => param.isValid)
    if (!isUserDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidBusinessHostData') }))
      return
    }

    const userCredentials: UserCredentials = {
      firstName: firstName.value,
      lastName: lastName.value,
      password: !!password.value ? password.value : undefined
    }

    dispatch(updateUserCredentials(userCredentials))
    handleClose()
  }

  return (
    <Dialog fullScreen={fullScreen} maxWidth="xs" open={isOpen} onClose={handleClose}>
      <DialogTitle className={classes.title}>{t('general.myProfile')}</DialogTitle>
      <DialogContent className={classes.content} dividers>
        <Typography className={classes.sectionTitle} component="h1">
          {t('company.userRole')}
        </Typography>

        <Typography className={classes.role} component="h1">
          {user ? t(`enum.${user.role}`) : ''}
        </Typography>

        <Typography className={classes.sectionTitle} component="h1">
          {t('general.basicData')}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField {...bindFirstName} id="user-first-name" label={t('auth.firstName')} variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField {...bindLastName} id="user-last-name" label={t('auth.lastName')} variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...bindPassword}
              id="user-password"
              label={t('auth.password')}
              type="password"
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DefaultDialogActions onSave={handleSave} onClose={handleClose} />
    </Dialog>
  )
}

export default UserProfileDialog
