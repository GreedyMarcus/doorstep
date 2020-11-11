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
import useInput from '../../components/shared/useInput'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { ConsentFormCreate } from '../../data/types/ConsentForm'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../store'
import { addNotification } from '../../store/action'
import { createConsentForm } from '../../store/consentForm'

type Props = {
  onClose: () => void
}

const ConsentFormDialog: React.FC<Props> = ({ onClose }) => {
  const classes = useStyles()
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const dispatch = useAppDispatch()
  const [isOpen, setOpen] = useState(true)
  const [t] = useTranslation()

  const [title, bindTitle] = useInput('', true)
  const [content, bindContent] = useInput('', true)

  const handleClose = () => {
    // This method provides smooth exit animation for the component
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  const handleSave = () => {
    const isConsentFormDataValid = [title, content].every(input => input.isValid)
    if (!isConsentFormDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidConsentFormData') }))
      return
    }

    const consentFormData: ConsentFormCreate = {
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
            <TextField {...bindTitle} id="consent-form-title" label={t('consentForm.title')} variant="outlined" fullWidth />
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
