import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import DefaultDialogActions from '../shared/DefaultDialogActions'
import useStyles from './useStyles'
import useGuestDialog from './useGuestDialog'
import { GuestUserRegister } from '../../data/types/User'
import { useTranslation } from 'react-i18next'

interface GuestDialogProps {
  onSave: (guest: GuestUserRegister) => void
  onClose: () => void
}

/**
 * Custom dialog component to get guest user info.
 */
const GuestDialog: React.FC<GuestDialogProps> = ({ onSave, onClose }) => {
  const classes = useStyles()

  const [t] = useTranslation()
  const [isOpen, bindEmail, bindFirstName, bindLastName, handleSave, handleClose] = useGuestDialog({ onSave, onClose })

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
