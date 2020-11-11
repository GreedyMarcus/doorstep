import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import InfoBox from '../../components/shared/InfoBox'
import VisitFilter from '../../components/VisitFilter'
import ResponsiveTable from '../../components/shared/ResponsiveTable'
import useStyles from './useStyles'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { visitsSelector, fetchVisits } from '../../store/visit'

const ConsentForms: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const visits = useSelector(visitsSelector)
  const [t, i18n] = useTranslation()

  const [filteredVisits, setFilteredVisits] = useState(visits)

  useEffect(() => {
    dispatch(fetchVisits())
  }, [])

  return (
    <Container className={classes.container} component="main" maxWidth="lg">
      <Paper elevation={3}>
        <Typography className={classes.title} variant="h1">
          {t('general.visits')}
        </Typography>
        {!visits.length ? (
          <InfoBox text={t('visit.noVisitInfo')} />
        ) : (
          <React.Fragment>
            <VisitFilter visits={visits} onFilterChange={visits => setFilteredVisits(visits)} />
            <ResponsiveTable
              labels={[t('visit.businessHostName'), t('visit.purpose'), t('visit.room'), t('visit.plannedEntry')]}
              data={filteredVisits.map(visit => ({
                id: visit.id,
                businessHostName: visit.businessHostName,
                purpose: visit.purpose,
                room: visit.room,
                plannedEntry: new Date(visit.plannedEntry).toLocaleDateString(i18n.language)
              }))}
              tooltipLabel={t('action.openVisit')}
              onOpenClick={visitId => history.push(`/visits/${visitId}`)}
            />
          </React.Fragment>
        )}
      </Paper>
    </Container>
  )
}

export default ConsentForms
