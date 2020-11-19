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
import { InvitationInfo } from '../../data/types/Visit'
import { useTranslation } from 'react-i18next'

type Props = {
  invitations: InvitationInfo[]
  onFilterChange: (invitations: InvitationInfo[]) => void
}

/**
 * Custom component to filter invitation data.
 */
const InvitationFilter: React.FC<Props> = ({ invitations, onFilterChange }) => {
  const classes = useStyles()
  const [t] = useTranslation()
  const [isOpen, setOpen] = useState(false)

  const [selectedCompanyNames, setSelectedCompanyNames] = useState([] as string[])
  const [selectedHostNames, setSelectedHostNames] = useState([] as string[])
  const [selectedPurposes, setSelectedPurposes] = useState([] as string[])
  const [selectedFromDate, setSelectedFromDate] = useState(null as Date | null)
  const [selectedUntilDate, setSelectedUntilDate] = useState(null as Date | null)

  const dateAdapter = new DateFnsAdapter()
  const { companyNames, hostNames, purposes } = invitations.reduce(
    (acc, invitation) => {
      acc.companyNames.add(invitation.companyName)
      acc.hostNames.add(invitation.businessHostName)
      acc.purposes.add(invitation.purpose)
      return acc
    },
    { companyNames: new Set<string>(), hostNames: new Set<string>(), purposes: new Set<string>() }
  )

  const handleClearClick = () => {
    setSelectedCompanyNames([])
    setSelectedHostNames([])
    setSelectedPurposes([])
    setSelectedFromDate(null)
    setSelectedUntilDate(null)
  }

  useEffect(() => {
    const filteredInvitations = invitations.filter(({ companyName, businessHostName, purpose, plannedEntry }) => {
      // Check company names
      if (selectedCompanyNames.length && !selectedCompanyNames.includes(companyName)) return false
      // Check host names
      if (selectedHostNames.length && !selectedHostNames.includes(businessHostName)) return false
      // Check purposes
      if (selectedPurposes.length && !selectedPurposes.includes(purpose)) return false
      // Check from date
      if (selectedFromDate && dateAdapter.isBefore(new Date(plannedEntry), selectedFromDate)) return false
      // Check until date
      if (selectedUntilDate && dateAdapter.isAfter(new Date(plannedEntry), selectedUntilDate)) return false

      return true
    })
    onFilterChange(filteredInvitations)
  }, [selectedCompanyNames, selectedHostNames, selectedPurposes, selectedFromDate, selectedUntilDate])

  return (
    <div className={classes.root}>
      <Accordion className={classes.accordion} expanded={isOpen} onChange={() => setOpen(!isOpen)}>
        <AccordionSummary expandIcon={<TuneRoundedIcon />}>
          <Typography>{t('visit.invitationFilter')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={4} className={classes.grid}>
            <Grid item md={6} sm={12} xs={12}>
              <MultiSelect
                id="company-name-label"
                label={t('company.name')}
                items={Array.from(companyNames)}
                selectedItems={selectedCompanyNames}
                onChange={value => setSelectedCompanyNames(value)}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <MultiSelect
                id="host-name-label"
                label={t('visit.businessHostName')}
                items={Array.from(hostNames)}
                selectedItems={selectedHostNames}
                onChange={value => setSelectedHostNames(value)}
              />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <MultiSelect
                id="purpose-label"
                label={t('visit.purpose')}
                items={Array.from(purposes)}
                selectedItems={selectedPurposes}
                onChange={value => setSelectedPurposes(value)}
              />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <LocalizedDateTimePicker
                label={t('visit.fromDate')}
                value={!!selectedFromDate ? new Date(selectedFromDate) : null}
                maxDate={!!selectedUntilDate ? new Date(selectedUntilDate) : undefined}
                onChange={date => setSelectedFromDate(date)}
              />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <LocalizedDateTimePicker
                label={t('visit.untilDate')}
                value={!!selectedUntilDate ? new Date(selectedUntilDate) : null}
                minDate={!!selectedFromDate ? new Date(selectedFromDate) : undefined}
                onChange={date => setSelectedUntilDate(date)}
              />
            </Grid>
            <Grid item xs={12} className={classes.clear}>
              <Button variant="contained" color="primary" onClick={handleClearClick}>
                {t('action.clear')}
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default InvitationFilter
