import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import DefaultDialogActions from '../shared/DefaultDialogActions'
import useStyles from './useStyles'
import { GuestUserRegister } from '../../data/types/User'
import { useTranslation } from 'react-i18next'

type Props = {
  guests: GuestUserRegister[]
  onSave: (guests: GuestUserRegister[]) => void
  onClose: () => void
}

/**
 * Custom dialog component to select guest users from list.
 */
const GuestSelectorDialog: React.FC<Props> = ({ guests, onSave, onClose }) => {
  const classes = useStyles()
  const [isOpen, setOpen] = useState(true)
  const [t] = useTranslation()
  const [checked, setChecked] = React.useState([] as number[])

  const toggle = (value: number) => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const handleClose = () => {
    // This method provides smooth exit animation for the component
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  const handleSave = () => {
    const selectedGuests = guests.filter((guest, index) => checked.includes(index))
    onSave(selectedGuests)
    handleClose()
  }

  return (
    <Dialog maxWidth="xs" open={isOpen} onClose={handleClose}>
      <DialogTitle className={classes.title}>{t('action.addGuestFromList')}</DialogTitle>
      <DialogContent className={classes.content} dividers>
        <List>
          {guests.map(({ email, firstName, lastName }, index) => (
            <ListItem key={`${email}-${index}`} dense button onClick={() => toggle(index)}>
              <ListItemIcon>
                <Checkbox edge="start" checked={checked.indexOf(index) !== -1} tabIndex={-1} disableRipple />
              </ListItemIcon>
              <ListItemText primary={`${firstName} ${lastName}`} secondary={email} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DefaultDialogActions onSave={handleSave} onClose={handleClose} />
    </Dialog>
  )
}

export default GuestSelectorDialog