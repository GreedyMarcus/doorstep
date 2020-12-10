import React, { useState } from 'react'
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
import useVisitSchedulerDialog from './useVisitSchedulerDialog'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { VisitCreate } from '../../data/types/Visit'
import { visitPurposeStrings } from '../../data/enums/VisitPurpose'
import { useTranslation } from 'react-i18next'

interface VisitSchedulerDialogProps {
  visit?: VisitCreate
  isEditing?: boolean
  onClose: () => void
}

/**
 * Custom dialog component to schedule visits.
 */
const VisitSchedulerDialog: React.FC<VisitSchedulerDialogProps> = ({ visit, isEditing, onClose }) => {
  const classes = useStyles()
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const [isGuestDialogOpen, setGuestDialogOpen] = useState(false)
  const [isGuestSelectorOpen, setGuestSelectorOpen] = useState(false)

  const [t] = useTranslation()
  const [
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
  ] = useVisitSchedulerDialog({ visit, isEditing, onClose })

  return (
    <>
      <Dialog fullScreen={fullScreen} maxWidth="sm" open={isOpen} onClose={handleClose}>
        <DialogTitle className={classes.title}>{t('page.visits.scheduler')}</DialogTitle>
        <DialogContent className={classes.content} dividers>
          <Typography className={classes.sectionTitle} component="h1">
            {t('page.visits.details')}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography className={classes.label}>{t('page.visits.purpose')}</Typography>
              <Select
                className={classes.select}
                fullWidth={fullScreen}
                variant="outlined"
                value={purpose}
                onChange={e => setPurpose(Number(e.target.value))}
              >
                {visitPurposeStrings.map((value, index) => (
                  <MenuItem key={value} value={index}>
                    {t(`enum.visitPurpose.${value}`)}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField {...bindRoom} label={t('common.room')} variant="outlined" fullWidth />
            </Grid>
            <Grid item sm={6} xs={12}>
              <LocalizedDateTimePicker
                label={t('page.visits.plannedEntry')}
                value={!!plannedEntry ? new Date(plannedEntry) : null}
                minDate={new Date()}
                onChange={date => setPlannedEntry(date)}
                inputVariant="outlined"
              />
            </Grid>
          </Grid>

          <Typography className={classes.guestSectionTitle} component="h1">
            {t('page.visits.guests')}
          </Typography>

          <Grid container>
            <Button
              className={classes.button}
              size="small"
              variant="contained"
              color="primary"
              onClick={() => setGuestDialogOpen(true)}
            >
              {t('action.add')}
            </Button>

            {!!availables.length && (
              <Button
                className={classes.button}
                size="small"
                variant="contained"
                color="primary"
                onClick={() => setGuestSelectorOpen(true)}
              >
                {t('action.addFromList')}
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
    </>
  )
}

export default VisitSchedulerDialog
