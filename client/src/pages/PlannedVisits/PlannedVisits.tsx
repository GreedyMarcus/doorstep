import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import InfoBox from '../../components/shared/InfoBox'
import PlannedVisitFilter from '../../components/PlannedVisitFilter'
import ResponsiveTable from '../../components/shared/ResponsiveTable'
import useStyles from './useStyles'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { plannedVisitsSelector, fetchPlannedVisits } from '../../store/visit'
import { getLocaleDateFormat } from '../../utils'

const PlannedVisits: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const plannedVisits = useSelector(plannedVisitsSelector)
  const [t] = useTranslation()

  const [filteredVisits, setFilteredVisits] = useState(plannedVisits)

  /**
   * Loads planned visits when component mounted.
   */
  useEffect(() => {
    dispatch(fetchPlannedVisits())
  }, [])

  return (
    <Container className={classes.container} component="main" maxWidth="lg">
      <Paper elevation={3}>
        <Typography className={classes.title} variant="h1">
          {t('page.plannedVisits.pageTitle')}
        </Typography>

        {!plannedVisits.length ? (
          <InfoBox text={t('page.plannedVisits.noScheduledVisitInfo')} type="info" />
        ) : (
          <>
            <PlannedVisitFilter visits={plannedVisits} onFilterChange={visits => setFilteredVisits(visits)} />
            <ResponsiveTable
              labels={[t('page.plannedVisits.purpose'), t('common.room'), t('page.plannedVisits.plannedEntry')]}
              data={filteredVisits.map(visit => ({
                id: visit.id,
                purpose: visit.purpose,
                room: visit.room,
                plannedEntry: getLocaleDateFormat(new Date(visit.plannedEntry))
              }))}
              tooltipLabel={t('action.openVisit')}
              onOpenClick={visitId => history.push(`/visits/${visitId}`)}
            />
          </>
        )}
      </Paper>
    </Container>
  )
}

export default PlannedVisits
