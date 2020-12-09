import useInput from '../../components/hooks/useInput'
import { useState, useEffect } from 'react'
import { VisitCreate } from '../../data/types/Visit'
import { GuestUserRegister } from '../../data/types/User'
import { visitPurposeStrings } from '../../data/enums/VisitPurpose'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { useTranslation } from 'react-i18next'
import { addNotification } from '../../store/action'
import { availableGuestUsersSelector, fetchAvailableGuestUsers } from '../../store/company'
import { createVisit } from '../../store/visit'

interface VititSchedulerDialogHookProps {
  visit?: VisitCreate
  isEditing?: boolean
  onClose: () => void
}

/**
 * Custom React hook that spearates the Visit scheduler dialog component logic.
 */
const useVisitSchedulerDialog = ({ visit, isEditing, onClose }: VititSchedulerDialogHookProps) => {
  const dispatch = useAppDispatch()
  const availableGuests = useSelector(availableGuestUsersSelector)
  const [t] = useTranslation()

  const [isOpen, setOpen] = useState(true)

  const [purpose, setPurpose] = useState(0)
  const [room, bindRoom] = useInput({ required: true })
  const [plannedEntry, setPlannedEntry] = useState(null as Date | null)
  const [guests, setGuests] = useState([] as GuestUserRegister[])

  const availables = availableGuests.filter(available => guests.every(guest => guest.email !== available.email))

  /**
   * Saves the validated guest to the guest list.
   */
  const addGuest = (newGuest: GuestUserRegister) => {
    if (guests.some(guest => guest.email === newGuest.email)) {
      dispatch(addNotification({ type: 'warning', message: t('notification.invalid.duplicatedGuest') }))
      return
    }
    setGuests([...guests, newGuest])
  }

  /**
   * Save multiple guests to the guest list.
   */
  const addMultipleGuests = (newGuests: GuestUserRegister[]) => {
    setGuests([...guests, ...newGuests])
  }

  /**
   * Removes the specified guest from the guest list.
   */
  const deleteGuest = (index: number) => {
    const items = [...guests]
    items.splice(index, 1)
    setGuests(items)
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
   * Saves the visit with the provided guest list.
   */
  const handleSave = () => {
    if (!room.valid || !plannedEntry || !guests.length) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalid.visit') }))
      return
    }

    const visitData: VisitCreate = {
      businessHostId: -1,
      purpose: visitPurposeStrings[purpose],
      room: room.value,
      plannedEntry: plannedEntry.toISOString(),
      invitedGuests: guests
    }

    dispatch(createVisit(visitData))
    handleClose()
  }

  /**
   * Loads available guests when the component mounted.
   */
  useEffect(() => {
    if (!availableGuests.length) {
      dispatch(fetchAvailableGuestUsers())
    }
  }, [])

  return [
    isOpen,
    purpose,
    setPurpose,
    bindRoom,
    plannedEntry,
    setPlannedEntry,
    guests,
    availables,
    addGuest,
    addMultipleGuests,
    deleteGuest,
    handleSave,
    handleClose
  ] as const
}

export default useVisitSchedulerDialog
