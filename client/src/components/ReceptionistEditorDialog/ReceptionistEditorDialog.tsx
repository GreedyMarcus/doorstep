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
import { EmployeeInfo } from '../../data/types/Company'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../store'
import { addNotification } from '../../store/action'
import { createReceptionist, updateReceptionist } from '../../store/building'

interface ReceptionistEditorDialogProps {
  receptionist?: EmployeeInfo
  isEditing?: boolean
  onClose: () => void
}

/**
 * Custom dialog component to create or edit receptionists.
 */
const ReceptionistEditorDialog: React.FC<ReceptionistEditorDialogProps> = ({ receptionist, isEditing, onClose }) => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const [isOpen, setOpen] = useState(true)

  const [firstName, bindFirstName] = useInput({ initialValue: receptionist?.firstName, required: true })
  const [lastName, bindLastName] = useInput({ initialValue: receptionist?.lastName, required: true })
  const [email, bindEmail] = useInput({ initialValue: receptionist?.email, required: true, validator: REGEXP.EMAIL })
  const [password, bindPassword] = useInput({ required: true, validator: REGEXP.PASSWORD })

  /**
   * Closes the dialog.
   */
  const handleClose = () => {
    // This method provides smooth exit animation for the component
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  /**
   * Saves the new or modified receptionist.
   */
  const handleSave = () => {
    const isReceptionistDataValid = [firstName, lastName, email].every(param => param.valid)
    if (!isReceptionistDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidData.receptionist') }))
      return
    }

    if (isEditing) {
      const modifiedReceptionistData = {
        id: receptionist?.id || -1,
        firstName: firstName.value,
        lastName: lastName.value
      }

      dispatch(updateReceptionist(modifiedReceptionistData))
      handleClose()
      return
    }

    const receptionistData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value
    }

    dispatch(createReceptionist(receptionistData))
    handleClose()
  }

  return (
    <Dialog fullScreen={fullScreen} maxWidth="xs" open={isOpen} onClose={handleClose}>
      <DialogTitle className={classes.title}>{t(`action.${isEditing ? 'editReceptionist' : 'addReceptionist'}`)}</DialogTitle>
      <DialogContent className={classes.content} dividers>
        <Typography className={classes.sectionTitle} component="h1">
          {t('page.receptionists.receptionistDetails')}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField {...bindFirstName} label={t('common.firstName')} variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField {...bindLastName} label={t('common.lastName')} variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField {...bindEmail} label={t('common.email')} disabled={isEditing} variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <PasswordField {...bindPassword} label={t('common.password')} disabled={isEditing} variant="outlined" fullWidth />
          </Grid>
        </Grid>
      </DialogContent>
      <DefaultDialogActions onSave={handleSave} onClose={handleClose} />
    </Dialog>
  )
}

export default ReceptionistEditorDialog
