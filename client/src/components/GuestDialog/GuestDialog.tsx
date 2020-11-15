import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import DefaultDialogActions from '../shared/DefaultDialogActions'
import useStyles from './useStyles'
import useInput from '../../components/shared/useInput'
import REGEXP from '../../utils/regexp'
import { GuestUserRegister } from '../../data/types/User'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../store'
import { addNotification } from '../../store/action'

type Props = {
  onSave: (guest: GuestUserRegister) => void
  onClose: () => void
}

/**
 * Custom dialog component to get guest user info.
 */
const GuestDialog: React.FC<Props> = ({ onSave, onClose }) => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const [isOpen, setOpen] = useState(true)
  const [t] = useTranslation()

  const [email, bindEmail] = useInput('', true, REGEXP.EMAIL)
  const [firstName, bindFirstName] = useInput('', true)
  const [lastName, bindLastName] = useInput('', true)

  const handleClose = () => {
    // This method provides smooth exit animation for the component
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  const handleSave = () => {
    const isGuestDataValid = [firstName, lastName, email].every(param => param.isValid)
    if (!isGuestDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidGuestData') }))
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

  return (
    <Dialog maxWidth="xs" open={isOpen} onClose={handleClose}>
      <DialogTitle className={classes.title}>{t('action.addGuest')}</DialogTitle>
      <DialogContent className={classes.content} dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField {...bindEmail} id="guest-email" label={t('auth.email')} variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...bindFirstName}
              id="guest-first-name"
              label={t('auth.firstName')}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...bindLastName}
              id="guest-last-name"
              label={t('auth.lastName')}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DefaultDialogActions onSave={handleSave} onClose={handleClose} />
    </Dialog>
  )
}

export default GuestDialog
