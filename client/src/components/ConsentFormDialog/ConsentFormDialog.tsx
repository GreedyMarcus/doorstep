import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import TextEditor from '../../components/TextEditor'
import DefaultDialogActions from '../shared/DefaultDialogActions'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import useConsentFormDialog from './useConsentFormDialog'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { useTranslation } from 'react-i18next'

interface ConsentFormDialogProps {
  onClose: () => void
}

/**
 * Custom dialog component to create consent forms.
 */
const ConsentFormDialog: React.FC<ConsentFormDialogProps> = ({ onClose }) => {
  const classes = useStyles()
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const [t] = useTranslation()
  const [isOpen, bindTitle, bindContent, changeContent, handleSave, handleClose] = useConsentFormDialog({ onClose })

  return (
    <Dialog fullScreen={fullScreen} maxWidth="md" open={isOpen} onClose={handleClose}>
      <DialogTitle className={classes.title}>{t('action.addConsentForm')}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField {...bindTitle} label={t('page.consentForms.formTitle')} variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextEditor {...bindContent} onValueChange={changeContent} fullScreen={fullScreen} />
          </Grid>
        </Grid>
      </DialogContent>
      <DefaultDialogActions onSave={handleSave} onClose={handleClose} />
    </Dialog>
  )
}

export default ConsentFormDialog
