import React from 'react'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import { useTranslation } from 'react-i18next'

type Props = {
  onSave: () => void
  onClose: () => void
}

/**
 * Custom component to provide default save and cancel actions for dialogs.
 */
const DefaultDialogActions: React.FC<Props> = ({ onSave, onClose }) => {
  const [t] = useTranslation()

  return (
    <DialogActions>
      <Button color="primary" onClick={onClose}>
        {t('general.cancel')}
      </Button>
      <Button color="primary" onClick={onSave}>
        {t('general.save')}
      </Button>
    </DialogActions>
  )
}

export default DefaultDialogActions
