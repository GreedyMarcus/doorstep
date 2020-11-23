import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import DefaultDialogActions from '../shared/DefaultDialogActions'
import useStyles from './useStyles'
import useInput from '../../components/hooks/useInput'
import REGEXP from '../../utils/regexp'
import { GuestUserRegister } from '../../data/types/User'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../store'
import { addNotification } from '../../store/action'

interface GuestDialogProps {
  onSave: (guest: GuestUserRegister) => void
  onClose: () => void
}

/**
 * Custom dialog component to get guest user info.
 */
const GuestDialog: React.FC<GuestDialogProps> = ({ onSave, onClose }) => {
  const classes = useStyles()
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
      dispatch(addNotification({ type: 'error', message: t('notification.invalidData.guest') }))
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
            <TextField {...bindEmail} label={t('common.email')} variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField {...bindFirstName} label={t('common.firstName')} variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField {...bindLastName} label={t('common.lastName')} variant="outlined" size="small" fullWidth />
          </Grid>
        </Grid>
      </DialogContent>
      <DefaultDialogActions onSave={handleSave} onClose={handleClose} />
    </Dialog>
  )
}

export default GuestDialog
