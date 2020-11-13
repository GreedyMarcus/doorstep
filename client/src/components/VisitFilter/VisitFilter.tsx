import React, { useEffect, useState } from 'react'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Typography from '@material-ui/core/Typography'
import TuneRoundedIcon from '@material-ui/icons/TuneRounded'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import MultiSelect from '../shared/MultiSelect'
import LocalizedDateTimePicker from '../shared/LocalizedDateTimePicker'
import useStyles from './useStyles'
import DateFnsAdapter from '@date-io/date-fns'
import { VisitInfo } from '../../data/types/Visit'
import { useTranslation } from 'react-i18next'

type Props = {
  visits: VisitInfo[]
  onFilterChange: (visits: VisitInfo[]) => void
}

/**
 * Custom component to filter visit data.
 */
const VisitFilter: React.FC<Props> = ({ visits, onFilterChange }) => {
  const classes = useStyles()
  const [t] = useTranslation()
  const [isOpen, setOpen] = useState(false)

  const [selectedHostNames, setSelectedHostNames] = useState([] as string[])
  const [selectedPurposes, setSelectedPurposes] = useState([] as string[])
  const [selectedFromDate, setSelectedFromDate] = useState('')
  const [selectedUntilDate, setSelectedUntilDate] = useState('')

  const dateAdapter = new DateFnsAdapter()
  const { hostNames, purposes } = visits.reduce(
    (acc, visit) => {
      acc.hostNames.add(visit.businessHostName)
      acc.purposes.add(visit.purpose)
      return acc
    },
    { hostNames: new Set<string>(), purposes: new Set<string>() }
  )

  const handleClearClick = () => {
    setSelectedHostNames([])
    setSelectedPurposes([])
    setSelectedFromDate('')
    setSelectedUntilDate('')
  }

  useEffect(() => {
    const filteredVisits = visits.filter(({ businessHostName, purpose, plannedEntry }) => {
      // Check host names
      if (selectedHostNames.length && !selectedHostNames.includes(businessHostName)) return false
      // Check purposes
      if (selectedPurposes.length && !selectedPurposes.includes(purpose)) return false
      // Check from date
      if (selectedFromDate && dateAdapter.isBefore(new Date(plannedEntry), new Date(selectedFromDate))) return false
      // Check until date
      if (selectedUntilDate && dateAdapter.isAfter(new Date(plannedEntry), new Date(selectedUntilDate))) return false

      return true
    })
    onFilterChange(filteredVisits)
  }, [selectedHostNames, selectedPurposes, selectedFromDate, selectedUntilDate])

  return (
    <div className={classes.root}>
      <Accordion className={classes.accordion} expanded={isOpen} onChange={() => setOpen(!isOpen)}>
        <AccordionSummary expandIcon={<TuneRoundedIcon />}>
          <Typography>{t('visit.filter')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={4} className={classes.grid}>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <MultiSelect
                id="host-name-label"
                label={t('visit.businessHostName')}
                items={Array.from(hostNames)}
                selectedItems={selectedHostNames}
                onChange={value => setSelectedHostNames(value)}
              />
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <MultiSelect
                id="purpose-label"
                label={t('visit.purpose')}
                items={Array.from(purposes)}
                selectedItems={selectedPurposes}
                onChange={value => setSelectedPurposes(value)}
              />
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <LocalizedDateTimePicker
                label={t('visit.fromDate')}
                value={!!selectedFromDate ? new Date(selectedFromDate) : null}
                maxDate={!!selectedUntilDate ? new Date(selectedUntilDate) : undefined}
                onChange={dateString => setSelectedFromDate(dateString)}
              />
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <LocalizedDateTimePicker
                label={t('visit.untilDate')}
                value={!!selectedUntilDate ? new Date(selectedUntilDate) : null}
                minDate={!!selectedFromDate ? new Date(selectedFromDate) : undefined}
                onChange={dateString => setSelectedUntilDate(dateString)}
              />
            </Grid>
            <Grid item xs={12} className={classes.clear}>
              <Button variant="contained" color="primary" onClick={handleClearClick}>
                {t('general.clear')}
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default VisitFilter
