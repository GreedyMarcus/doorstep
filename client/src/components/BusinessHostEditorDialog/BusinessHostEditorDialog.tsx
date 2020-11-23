import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import PasswordField from '../shared/PasswordField'
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
import { createBusinessHost, updateBusinessHost } from '../../store/company'

interface BusinessHostEditorDialogProps {
  businessHost?: EmployeeInfo
  isEditing?: boolean
  onClose: () => void
}

/**
 * Custom dialog component to create or edit business hosts.
 */
const BusinessHostEditorDialog: React.FC<BusinessHostEditorDialogProps> = ({ businessHost, isEditing, onClose }) => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const [isOpen, setOpen] = useState(true)

  const [firstName, bindFirstName] = useInput({ initialValue: businessHost?.firstName, required: true })
  const [lastName, bindLastName] = useInput({ initialValue: businessHost?.lastName, required: true })
  const [email, bindEmail] = useInput({ initialValue: businessHost?.email, required: true, validator: REGEXP.EMAIL })
  const [password, bindPassword] = useInput({ required: true, validator: REGEXP.PASSWORD })

  /**
   * Closes the dialog.
   */
  const handleClose = () => {
    // This method provides smooth exit animation for the component.
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  /**
   * Saves the new or modified business host.
   */
  const handleSave = () => {
    const isBusinessHostDataValid = [firstName, lastName, email].every(param => param.valid)
    if (!isBusinessHostDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidData.businessHost') }))
      return
    }

    if (isEditing) {
      const modifiedBusinessHostData = {
        id: businessHost?.id || -1,
        firstName: firstName.value,
        lastName: lastName.value
      }

      dispatch(updateBusinessHost(modifiedBusinessHostData))
      handleClose()
      return
    }

    const businessHostData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value
    }

    dispatch(createBusinessHost(businessHostData))
    handleClose()
  }

  return (
    <Dialog fullScreen={fullScreen} maxWidth="xs" open={isOpen} onClose={handleClose}>
      <DialogTitle className={classes.title}>{t(`action.${isEditing ? 'editBusinessHost' : 'addBusinessHost'}`)}</DialogTitle>
      <DialogContent className={classes.content} dividers>
        <Typography className={classes.sectionTitle} component="h1">
          {t('page.businessHosts.hostDetails')}
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

export default BusinessHostEditorDialog
