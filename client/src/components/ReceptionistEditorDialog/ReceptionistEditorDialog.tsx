import React from 'react'
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
import useReceptionistEditorDialog from './useReceptionistEditorDialog'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { EmployeeInfo } from '../../data/types/Company'
import { useTranslation } from 'react-i18next'

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
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const [t] = useTranslation()
  const [isOpen, bindFirstName, bindLastName, bindEmail, bindPassword, handleSave, handleClose] = useReceptionistEditorDialog({
    receptionist,
    isEditing,
    onClose
  })

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
