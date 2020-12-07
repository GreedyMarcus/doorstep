import React, { useEffect, useState } from 'react'
import Widget from '../../components/shared/Widget'
import InvitationFilter from '../../components/InvitationFilter'
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
import { invitationsSelector, fetchInvitations } from '../../store/visit'
import { getLocaleDateFormat } from '../../utils'

/**
 * The invitations page where the current invitations are displayed.
 */
const Invitations: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const invitations = useSelector(invitationsSelector)
  const [filteredInvitations, setFilteredInvitations] = useState(invitations)

  /**
   * Loads invitations when the component mounted.
   */
  useEffect(() => {
    dispatch(fetchInvitations())
  }, [])

  return (
    <Widget
      title={t('page.invitations.invitations')}
      showContent={!!invitations}
      hasContent={!!invitations?.length}
      infoText={t('page.invitations.noInvitationInfo')}
    >
      <>
        <InvitationFilter invitations={invitations} onFilterChange={invitations => setFilteredInvitations(invitations)} />
        <TableContainer className={classes.tableContainer}>
          <Table>
            <ResponsiveTableHead
              labels={[
                t('page.invitations.companyName'),
                t('page.invitations.businessHostName'),
                t('page.invitations.purpose'),
                t('common.room'),
                t('page.invitations.plannedEntry')
              ]}
              emptyEnd
            />
            <TableBody>
              {filteredInvitations?.map(invitation => (
                <ResponsiveTableRow
                  key={invitation.id}
                  labels={[
                    invitation.companyName,
                    invitation.businessHostName,
                    t(`enum.visitPurpose.${invitation.purpose}`),
                    invitation.room,
                    getLocaleDateFormat(new Date(invitation.plannedEntry))
                  ]}
                  extraCell={
                    <OpenTableCell
                      tooltip={t('action.openInvitation')}
                      onOpen={() => history.push(`/invitations/${invitation.id}`)}
                    />
                  }
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    </Widget>
  )
}

export default Invitations
