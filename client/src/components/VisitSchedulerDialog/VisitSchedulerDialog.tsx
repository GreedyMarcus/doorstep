import React, { useState, useEffect } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import LocalizedDateTimePicker from '../shared/LocalizedDateTimePicker'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import GuestDialog from '../GuestDialog'
import GuestSelectorDialog from '../GuestSelectorDialog'
import DefaultDialogActions from '../shared/DefaultDialogActions'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import useInput from '../../components/shared/useInput'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { VisitCreate } from '../../data/types/Visit'
import { GuestUserRegister } from '../../data/types/User'
import { visitPurposeStrings } from '../../data/enums/VisitPurpose'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { addNotification } from '../../store/action'
import { availableGuestUsersSelector, fetchAvailableGuestUsers } from '../../store/company'
import { createVisit } from '../../store/visit'

type Props = {
  visit?: VisitCreate
  isEditing?: boolean
  onClose: () => void
}

/**
 * Custom dialog component to schedule visits.
 */
const VisitSchedulerDialog: React.FC<Props> = ({ visit, isEditing, onClose }) => {
  const classes = useStyles()
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const dispatch = useAppDispatch()
  const availableGuests = useSelector(availableGuestUsersSelector)
  const [isOpen, setOpen] = useState(true)
  const [t] = useTranslation()

  const [purpose, setPurpose] = useState(0)
  const [room, bindRoom] = useInput('', true)
  const [plannedEntry, setPlannedEntry] = useState(null as Date | null)
  const [guests, setGuests] = useState([] as GuestUserRegister[])

  const [isGuestDialogOpen, setGuestDialogOpen] = useState(false)
  const [isGuestSelectorOpen, setGuestSelectorOpen] = useState(false)

  const addGuest = (newGuest: GuestUserRegister) => {
    if (guests.some(guest => guest.email === newGuest.email)) {
      dispatch(addNotification({ type: 'error', message: t('notification.duplicatedGuest') }))
      return
    }

    setGuests([...guests, newGuest])
  }

  const addMultipleGuests = (newGuests: GuestUserRegister[]) => {
    setGuests([...guests, ...newGuests])
  }

  const deleteGuest = (index: number) => {
    const items = [...guests]
    items.splice(index, 1)
    setGuests(items)
  }

  const handleClose = () => {
    // This method provides smooth exit animation for the component
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  const handleSave = () => {
    if (!room.isValid || !plannedEntry || !guests.length) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidVisitData') }))
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

  useEffect(() => {
    if (!availableGuests.length) {
      dispatch(fetchAvailableGuestUsers())
    }
  }, [])

  const availables = availableGuests.filter(available => guests.every(guest => guest.email !== available.email))

  return (
    <React.Fragment>
      <Dialog fullScreen={fullScreen} maxWidth="sm" open={isOpen} onClose={handleClose}>
        <DialogTitle className={classes.title}>{t('visit.scheduler')}</DialogTitle>
        <DialogContent className={classes.content} dividers>
          <Typography className={classes.sectionTitle} component="h1">
            {t('visit.details')}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography className={classes.label}>{t('visit.purpose')}</Typography>
              <Select
                className={classes.select}
                fullWidth={fullScreen}
                variant="outlined"
                value={purpose}
                onChange={e => setPurpose(Number(e.target.value))}
              >
                {visitPurposeStrings.map((value, index) => (
                  <MenuItem key={value} value={index}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField {...bindRoom} id="visit-room" label={t('visit.room')} variant="outlined" fullWidth />
            </Grid>
            <Grid item sm={6} xs={12}>
              <LocalizedDateTimePicker
                label={t('visit.plannedEntry')}
                value={!!plannedEntry ? new Date(plannedEntry) : null}
                minDate={new Date()}
                onChange={date => setPlannedEntry(date)}
                inputVariant="outlined"
              />
            </Grid>
          </Grid>

          <Typography className={classes.guestSectionTitle} component="h1">
            {t('visit.guests')}
          </Typography>

          <Grid container>
            <Button
              className={classes.button}
              size="small"
              variant="contained"
              color="primary"
              onClick={() => setGuestDialogOpen(true)}
            >
              {t('general.add')}
            </Button>

            {!!availables.length && (
              <Button
                className={classes.button}
                size="small"
                variant="contained"
                color="primary"
                onClick={() => setGuestSelectorOpen(true)}
              >
                {t('general.addFromList')}
              </Button>
            )}
          </Grid>

          <List className={classes.list} dense>
            {guests.map(({ email, firstName, lastName }, index) => (
              <ListItem className={classes.listItem} key={`${email}-${index}`}>
                <ListItemText primary={`${firstName} ${lastName}`} secondary={email} />
                <ListItemSecondaryAction>
                  <IconButton color="secondary" edge="end" onClick={() => deleteGuest(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DefaultDialogActions onSave={handleSave} onClose={handleClose} />
      </Dialog>

      {isGuestDialogOpen && <GuestDialog onSave={addGuest} onClose={() => setGuestDialogOpen(false)} />}
      {isGuestSelectorOpen && (
        <GuestSelectorDialog guests={availables} onSave={addMultipleGuests} onClose={() => setGuestSelectorOpen(false)} />
      )}
    </React.Fragment>
  )
}

export default VisitSchedulerDialog
