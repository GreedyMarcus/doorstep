import React, { useEffect } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import InfoBox from '../../components/shared/InfoBox'
import ResponsiveTable from '../../components/shared/ResponsiveTable'
import useStyles from './useStyles'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { guestInvitationsSelector, fetchGuestInvitations } from '../../store/visit'
import { getLocaleDateFormat } from '../../utils'

const GuestInvitations: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const guestInvitations = useSelector(guestInvitationsSelector)
  const [t] = useTranslation()

  useEffect(() => {
    dispatch(fetchGuestInvitations())
  }, [])

  return (
    <Container className={classes.container} component="main" maxWidth="lg">
      <Paper elevation={3}>
        <Typography className={classes.title} variant="h1">
          {t('general.invitations')}
        </Typography>
        {!guestInvitations.length ? (
          <InfoBox text={t('visit.noInvitationInfo')} type="info" />
        ) : (
          <ResponsiveTable
            labels={[t('company.name'), t('general.address'), t('visit.purpose'), t('visit.plannedEntry')]}
            data={guestInvitations.map(invitation => ({
              id: invitation.id,
              companyName: invitation.companyName,
              buildingAddress: invitation.buildingAddress,
              purpose: invitation.purpose,
              plannedEntry: getLocaleDateFormat(new Date(invitation.plannedEntry))
            }))}
            tooltipLabel={t('action.openInvitation')}
            onOpenClick={invitationId => history.push(`/guest-invitations/${invitationId}`)}
          />
        )}
      </Paper>
    </Container>
  )
}

export default GuestInvitations
