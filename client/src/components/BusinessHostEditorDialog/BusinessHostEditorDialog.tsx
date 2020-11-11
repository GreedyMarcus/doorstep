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
import { BusinessHostInfo } from '../../data/types/User'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../store'
import { addNotification } from '../../store/action'

type Props = {
  businessHost?: BusinessHostInfo
  isEditing?: boolean
  onClose: () => void
}

const BusinessHostEditorDialog: React.FC<Props> = ({ businessHost, isEditing, onClose }) => {
  const classes = useStyles()
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const dispatch = useAppDispatch()
  const [isOpen, setOpen] = useState(true)
  const [t] = useTranslation()

  const [firstName, bindFirstName] = useInput(businessHost?.firstName || '', true)
  const [lastName, bindLastName] = useInput(businessHost?.lastName || '', true)
  const [email, bindEmail] = useInput(businessHost?.email || '', true, REGEXP.EMAIL)
  const [password, bindPassword] = useInput('', true, REGEXP.PASSWORD)

  const handleClose = () => {
    // This method provides smooth exit animation for the component
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  const handleSave = () => {
    const isBusinessHostDataValid = [firstName, lastName, email, password].every(param => param.isValid)
    if (!isBusinessHostDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidBusinessHostData') }))
      return
    }

    const businessHostData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value
    }

    // TODO: Send HTTP request and save business host!
    console.log(businessHostData)

    handleClose()
  }

  return (
    <Dialog fullScreen={fullScreen} maxWidth="xs" open={isOpen} onClose={handleClose}>
      <DialogTitle className={classes.title}>{t(`action.${isEditing ? 'editBusinessHost' : 'addBusinessHost'}`)}</DialogTitle>
      <DialogContent className={classes.content} dividers>
        <Typography className={classes.sectionTitle} component="h1">
          {t('company.businessHostDetails')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              {...bindFirstName}
              id="business-host-first-name"
              label={t('auth.firstName')}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField {...bindLastName} id="business-host-last-name" label={t('auth.lastName')} variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...bindEmail}
              id="business-host-email"
              label={t('auth.email')}
              disabled={isEditing}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...bindPassword}
              id="business-host-password"
              label={t('auth.password')}
              disabled={isEditing}
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

export default BusinessHostEditorDialog
