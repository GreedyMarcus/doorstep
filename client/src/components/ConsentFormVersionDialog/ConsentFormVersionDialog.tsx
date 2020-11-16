import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { useTranslation } from 'react-i18next'
import { ConsentFormVersionDetails } from '../../data/types/ConsentForm'

type Props = {
  consentFormVersion: ConsentFormVersionDetails
  onClose: () => void
}

/**
 * Custom dialog component to show consent form version content.
 */
const ConsentFormVersionDialog: React.FC<Props> = ({ consentFormVersion, onClose }) => {
  const classes = useStyles()
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const [isOpen, setOpen] = useState(true)
  const [t] = useTranslation()

  const handleClose = () => {
    // This method provides smooth exit animation for the component
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  return (
    <Dialog fullScreen={fullScreen} maxWidth="md" open={isOpen} onClose={handleClose}>
      <DialogTitle className={classes.title}>{consentFormVersion.title}</DialogTitle>
      <DialogContent className={classes.content} dividers>
        <div dangerouslySetInnerHTML={{ __html: consentFormVersion.content }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t('action.ok')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConsentFormVersionDialog
