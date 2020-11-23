import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import InfoBox from '../../components/shared/InfoBox'
import InvitationFilter from '../../components/InvitationFilter'
import ResponsiveTable from '../../components/shared/ResponsiveTable'
import useStyles from './useStyles'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { invitationsSelector, fetchInvitations } from '../../store/visit'
import { getLocaleDateFormat } from '../../utils'

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
    <Container className={classes.container} component="main" maxWidth="lg">
      <Paper elevation={3}>
        <Typography className={classes.title} variant="h1">
          {t('page.invitations.invitations')}
        </Typography>

        {!invitations.length ? (
          <InfoBox text={t('page.invitations.noInvitationInfo')} type="info" />
        ) : (
          <>
            <InvitationFilter invitations={invitations} onFilterChange={invitations => setFilteredInvitations(invitations)} />
            <ResponsiveTable
              labels={[
                t('page.invitations.companyName'),
                t('page.invitations.businessHostName'),
                t('page.invitations.purpose'),
                t('common.room'),
                t('page.invitations.plannedEntry')
              ]}
              data={filteredInvitations.map(invitation => ({
                id: invitation.id,
                companyName: invitation.companyName,
                businessHostName: invitation.businessHostName,
                purpose: invitation.purpose,
                room: invitation.room,
                plannedEntry: getLocaleDateFormat(new Date(invitation.plannedEntry))
              }))}
              tooltipLabel={t('action.openInvitation')}
              onOpenClick={visitId => history.push(`/invitations/${visitId}`)}
            />
          </>
        )}
      </Paper>
    </Container>
  )
}

export default Invitations
