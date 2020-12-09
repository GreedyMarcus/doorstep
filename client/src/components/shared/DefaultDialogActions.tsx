import React from 'react'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import { useTranslation } from 'react-i18next'

interface DefaultDialogActionsProps {
  onSave: () => void
  onClose: () => void
}

/**
 * Custom component to provide default save and cancel actions for dialogs.
 */
const DefaultDialogActions: React.FC<DefaultDialogActionsProps> = ({ onSave, onClose }) => {
  const [t] = useTranslation()

  return (
    <DialogActions>
      <Button color="primary" onClick={onClose}>
        {t('action.cancel')}
      </Button>
      <Button color="primary" onClick={onSave}>
        {t('action.save')}
      </Button>
    </DialogActions>
  )
}

export default DefaultDialogActions
