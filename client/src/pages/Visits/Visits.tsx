import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded'
import InfoBox from '../../components/shared/InfoBox'
import VisitFilter from '../../components/VisitFilter'
import ResponsiveTable from '../../components/shared/ResponsiveTable'
import CompanyConfigDialog from '../../components/CompanyConfigDialog'
import useStyles from './useStyles'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { visitsSelector, fetchVisits } from '../../store/visit'
import { getLocaleDateFormat } from '../../utils'

const Visits: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const visits = useSelector(visitsSelector)
  const [t] = useTranslation()

  const [showConfig, setShowConfig] = useState(false)
  const [filteredVisits, setFilteredVisits] = useState(visits)

  useEffect(() => {
    dispatch(fetchVisits())
  }, [])

  return (
    <React.Fragment>
      <Container className={classes.container} component="main" maxWidth="lg">
        <Paper elevation={3}>
          <Grid container>
            <Grid item sm={10} xs={9}>
              <Typography className={classes.title} variant="h1">
                {t('general.visits')}
              </Typography>
            </Grid>
            <Grid item sm={2} xs={3} className={classes.settings}>
              <Tooltip title={t('general.settings').toString()}>
                <IconButton onClick={() => setShowConfig(true)}>
                  <SettingsRoundedIcon className={classes.settingsIcon} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>

          {!visits.length ? (
            <InfoBox text={t('visit.noVisitInfo')} type="info" />
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
                  plannedEntry: getLocaleDateFormat(new Date(visit.plannedEntry))
                }))}
                tooltipLabel={t('action.openVisit')}
                onOpenClick={visitId => history.push(`/visits/${visitId}`)}
              />
            </React.Fragment>
          )}
        </Paper>
      </Container>
      {showConfig && <CompanyConfigDialog onClose={() => setShowConfig(false)} />}
    </React.Fragment>
  )
}

export default Visits
