import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import PasswordField from '../../components/shared/PasswordField'
import DefaultDialogActions from '../shared/DefaultDialogActions'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import useInput from '../../components/hooks/useInput'
import REGEXP from '../../utils/regexp'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { addNotification } from '../../store/action'
import { activeUserSelector, updateUserCredentials } from '../../store/user'

interface UserProfileDialogProps {
  onClose: () => void
}

/**
 * Custom dialog component to edit user credentials.
 */
const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ onClose }) => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const user = useSelector(activeUserSelector)
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
      dispatch(addNotification({ type: 'error', message: t('notification.invalidData.user') }))
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

  return (
    <Dialog fullScreen={fullScreen} maxWidth="xs" open={isOpen} onClose={handleClose}>
      <DialogTitle className={classes.title}>{t('common.myProfile')}</DialogTitle>
      <DialogContent className={classes.content} dividers>
        <Typography className={classes.sectionTitle} component="h1">
          {t('common.userRole')}
        </Typography>

        <Typography className={classes.role} component="h1">
          {user ? t(`enum.${user.role}`) : ''}
        </Typography>

        <Typography className={classes.sectionTitle} component="h1">
          {t('common.basicData')}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField {...bindFirstName} label={t('common.firstName')} variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField {...bindLastName} label={t('common.lastName')} variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <PasswordField {...bindPassword} label={t('common.password')} variant="outlined" fullWidth />
          </Grid>
        </Grid>
      </DialogContent>
      <DefaultDialogActions onSave={handleSave} onClose={handleClose} />
    </Dialog>
  )
}

export default UserProfileDialog
