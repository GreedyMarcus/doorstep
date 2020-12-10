import React, { useEffect, useState } from 'react'
import Widget from '../../components/shared/Widget'
import VisitFilter from '../../components/VisitFilter'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import ResponsiveTableHead from '../../components/shared/ResponsiveTableHead'
import TableBody from '@material-ui/core/TableBody'
import ResponsiveTableRow from '../../components/shared/ResponsiveTableRow'
import OpenTableCell from '../../components/shared/OpenTableCell'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import SettingsRoundedIcon from '@material-ui/icons/SettingsRounded'
import CompanyConfigDialog from '../../components/CompanyConfigDialog'
import useStyles from './useStyles'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { visitsSelector, fetchVisits } from '../../store/visit'
import { getLocaleDateFormat } from '../../utils'

/**
 * The visits page where the current visits are displayed.
 */
const Visits: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const visits = useSelector(visitsSelector)
  const [showConfig, setShowConfig] = useState(false)
  const [filteredVisits, setFilteredVisits] = useState(visits)

  /**
   * Loads visits when component mounted.
   */
  useEffect(() => {
    dispatch(fetchVisits())
  }, [])

  return (
    <>
      <Widget
        titleComponent={
          <Grid container>
            <Grid item sm={10} xs={9}>
              <Typography className={classes.title} variant="h1">
                {t('page.visits.pageTitle')}
              </Typography>
            </Grid>
            <Grid item sm={2} xs={3} className={classes.settings}>
              <Tooltip title={t('common.settings').toString()}>
                <IconButton onClick={() => setShowConfig(true)}>
                  <SettingsRoundedIcon className={classes.settingsIcon} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        }
        showContent={!!visits}
        hasContent={!!visits?.length}
        infoText={t('page.visits.noVisitInfo')}
      >
        <>
          <VisitFilter visits={visits} onFilterChange={visits => setFilteredVisits(visits)} />
          <TableContainer className={classes.tableContainer}>
            <Table>
              <ResponsiveTableHead
                labels={[
                  t('page.visits.businessHostName'),
                  t('page.visits.purpose'),
                  t('common.room'),
                  t('page.visits.plannedEntry')
                ]}
                emptyEnd
              />
              <TableBody>
                {filteredVisits?.map(visit => (
                  <ResponsiveTableRow
                    key={visit.id}
                    labels={[
                      visit.businessHostName,
                      t(`enum.visitPurpose.${visit.purpose}`),
                      visit.room,
                      getLocaleDateFormat(new Date(visit.plannedEntry))
                    ]}
                    extraCell={
                      <OpenTableCell tooltip={t('action.openVisit')} onOpen={() => history.push(`/visits/${visit.id}`)} />
                    }
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      </Widget>
      {showConfig && <CompanyConfigDialog onClose={() => setShowConfig(false)} />}
    </>
  )
}

export default Visits
