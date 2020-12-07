import { useState } from 'react'
import { GuestUserRegister } from '../../data/types/User'

interface GuestSelectorDialogHookProps {
  guests: GuestUserRegister[]
  onSave: (guests: GuestUserRegister[]) => void
  onClose: () => void
}

/**
 * Custom React hook that spearates the Guest selector dialog component logic.
 */
const useGuestSelectorDialog = ({ guests, onSave, onClose }: GuestSelectorDialogHookProps) => {
  const [isOpen, setOpen] = useState(true)
  const [checked, setChecked] = useState([] as number[])

  /**
   * Switches the state of the checkbox
   */
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

  /**
   * Closes the dialog.
   */
  const handleClose = () => {
    // This method provides smooth exit animation for the component
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  /**
   * Returns the selected guest users with the provided callback function.
   */
  const handleSave = () => {
    const selectedGuests = guests.filter((_guest, index) => checked.includes(index))
    onSave(selectedGuests)
    handleClose()
  }

  return [isOpen, checked, toggle, handleSave, handleClose] as const
}

export default useGuestSelectorDialog
