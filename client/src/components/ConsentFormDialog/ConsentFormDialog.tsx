import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import TextEditor from '../../components/TextEditor'
import DefaultDialogActions from '../shared/DefaultDialogActions'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import useInput from '../../components/hooks/useInput'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../store'
import { addNotification } from '../../store/action'
import { createConsentForm } from '../../store/consentForm'

interface ConsentFormDialogProps {
  onClose: () => void
}

/**
 * Custom dialog component to create consent forms.
 */
const ConsentFormDialog: React.FC<ConsentFormDialogProps> = ({ onClose }) => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const [isOpen, setOpen] = useState(true)

  const [title, bindTitle] = useInput({ required: true })
  const [content, bindContent] = useInput({ required: true })

  /**
   * Closes the dialog.
   */
  const handleClose = () => {
    // This method provides smooth exit animation for the component.
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  /**
   * Saves the new consent form.
   */
  const handleSave = () => {
    const isConsentFormDataValid = [title, content].every(input => input.valid)
    if (!isConsentFormDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidData.consentForm') }))
      return
    }

    const consentFormData = {
      title: title.value,
      content: content.value
    }

    dispatch(createConsentForm(consentFormData))
    handleClose()
  }

  return (
    <Dialog fullScreen={fullScreen} maxWidth="md" open={isOpen} onClose={handleClose}>
      <DialogTitle className={classes.title}>{t('action.addConsentForm')}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField {...bindTitle} label={t('page.consentForms.formTitle')} variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextEditor {...bindContent} fullScreen={fullScreen} />
          </Grid>
        </Grid>
      </DialogContent>
      <DefaultDialogActions onSave={handleSave} onClose={handleClose} />
    </Dialog>
  )
}

export default ConsentFormDialog
