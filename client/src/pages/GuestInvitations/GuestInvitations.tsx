import React, { useEffect } from 'react'
import Widget from '../../components/shared/Widget'
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
import { guestInvitationsSelector, fetchGuestInvitations } from '../../store/visit'
import { getLocaleDateFormat } from '../../utils'

/**
 * The guest invitations page where the current guest invitations are displayed.
 */
const GuestInvitations: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const guestInvitations = useSelector(guestInvitationsSelector)
  const [t] = useTranslation()

  /**
   * Loads guest invitations when the component mounted.
   */
  useEffect(() => {
    dispatch(fetchGuestInvitations())
  }, [])

  return (
    <Widget
      title={t('page.guestInvitations.invitations')}
      showContent={!!guestInvitations}
      hasContent={!!guestInvitations?.length}
      infoText={t('page.guestInvitations.noInvitationInfo')}
    >
      <TableContainer className={classes.tableContainer}>
        <Table>
          <ResponsiveTableHead
            labels={[
              t('page.guestInvitations.companyName'),
              t('common.address'),
              t('page.guestInvitations.purpose'),
              t('page.guestInvitations.plannedEntry')
            ]}
            emptyEnd
          />
          <TableBody>
            {guestInvitations?.map(invitation => (
              <ResponsiveTableRow
                key={invitation.id}
                labels={[
                  invitation.companyName,
                  invitation.buildingAddress,
                  t(`enum.visitPurpose.${invitation.purpose}`),
                  getLocaleDateFormat(new Date(invitation.plannedEntry))
                ]}
                extraCell={
                  <OpenTableCell
                    tooltip={t('action.openInvitation')}
                    onOpen={() => history.push(`/guest-invitations/${invitation.id}`)}
                  />
                }
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Widget>
  )
}

export default GuestInvitations
