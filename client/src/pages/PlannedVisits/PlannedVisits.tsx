import React, { useEffect, useState } from 'react'
import Widget from '../../components/shared/Widget'
import PlannedVisitFilter from '../../components/PlannedVisitFilter'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import ResponsiveTableHead from '../../components/shared/ResponsiveTableHead'
import TableBody from '@material-ui/core/TableBody'
import ResponsiveTableRow from '../../components/shared/ResponsiveTableRow'
import OpenTableCell from '../../components/shared/OpenTableCell'
import useStyles from './useStyles'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { plannedVisitsSelector, fetchPlannedVisits } from '../../store/visit'
import { getLocaleDateFormat } from '../../utils'

/**
 * The planned visits page where the current planned visits are displayed.
 */
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
    <Widget
      title={t('page.plannedVisits.pageTitle')}
      showContent={!!plannedVisits}
      hasContent={!!plannedVisits?.length}
      infoText={t('page.plannedVisits.noScheduledVisitInfo')}
    >
      <>
        <PlannedVisitFilter visits={plannedVisits} onFilterChange={visits => setFilteredVisits(visits)} />
        <TableContainer className={classes.tableContainer}>
          <Table>
            <ResponsiveTableHead
              labels={[t('page.plannedVisits.purpose'), t('common.room'), t('page.plannedVisits.plannedEntry')]}
              emptyEnd
            />
            <TableBody>
              {filteredVisits?.map(visit => (
                <ResponsiveTableRow
                  key={visit.id}
                  labels={[
                    t(`enum.visitPurpose.${visit.purpose}`),
                    visit.room,
                    getLocaleDateFormat(new Date(visit.plannedEntry))
                  ]}
                  extraCell={<OpenTableCell tooltip={t('action.openVisit')} onOpen={() => history.push(`/visits/${visit.id}`)} />}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    </Widget>
  )
}

export default PlannedVisits
