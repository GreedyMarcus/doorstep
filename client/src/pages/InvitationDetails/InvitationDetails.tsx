import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import InfoBox from '../../components/shared/InfoBox'
import Grid from '@material-ui/core/Grid'
import ResponsiveTable from '../../components/shared/ResponsiveTable'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded'
import ConsentFormVersionDialog from '../../components/ConsentFormVersionDialog'
import useStyles from './useStyles'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { activeVisitSelector, fetchVisitById } from '../../store/visit'
import { ConsentFormVersionDetails } from '../../data/types/ConsentForm'
import { getLocaleDateFormat } from '../../utils'

/**
 * The invitation details page where the current invitation is displayed.
 */
const InvitationDetails: React.FC<RouteComponentProps> = ({ match: { params: routeParams } }) => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const [t, i18n] = useTranslation()

  const activeVisit = useSelector(activeVisitSelector)
  const [openedFormVersion, setOpenedFormVersion] = useState(null as ConsentFormVersionDetails | null)

  /**
   * Loads visits when the component mounted.
   */
  useEffect(() => {
    dispatch(fetchVisitById(routeParams['visitId']))
  }, [])

  const visitData = [
    { labelLanguageKey: 'page.invitations.companyName', value: activeVisit?.companyName || '' },
    { labelLanguageKey: 'page.invitations.businessHostName', value: activeVisit?.businessHost.fullName || '' },
    { labelLanguageKey: 'page.invitations.businessHostEmail', value: activeVisit?.businessHost.email || '' },
    { labelLanguageKey: 'page.invitations.purpose', value: activeVisit?.purpose || '' },
    { labelLanguageKey: 'common.room', value: activeVisit?.room || '' },
    {
      labelLanguageKey: 'page.invitations.plannedEntry',
      value: activeVisit ? getLocaleDateFormat(new Date(activeVisit.plannedEntry)) : ''
    }
  ]
  const unknownText = t('common.unknownData')

  return (
    <>
      <Container className={classes.container} component="main" maxWidth="lg">
        <Paper elevation={3}>
          <Typography className={classes.title} variant="h1">
            {t('page.invitations.invitationDetails')}
          </Typography>

          {!activeVisit ? (
            <InfoBox text={t('page.invitations.invitationNotFound')} type="error" />
          ) : (
            <React.Fragment>
              <Grid className={classes.grid} container spacing={2}>
                <Grid item xs={12}>
                  <Typography className={classes.sectionTitle} component="h2">
                    {t('page.invitations.invitationData')}
                  </Typography>
                </Grid>

                {visitData.map(({ labelLanguageKey, value }) => (
                  <Grid item md={4} sm={6} xs={12} key={labelLanguageKey}>
                    <Typography className={classes.label} component="label">
                      {t(labelLanguageKey)}
                    </Typography>
                    <Typography className={classes.text} component="h2">
                      {value}
                    </Typography>
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Typography className={classes.sectionTitle} component="h2">
                    {t('page.invitations.invitedGuests')}
                  </Typography>
                </Grid>
              </Grid>

              <ResponsiveTable
                labels={[
                  t('page.invitations.guestName'),
                  t('page.invitations.actualEntry'),
                  t('page.invitations.actualExit'),
                  t('page.invitations.receptionistName'),
                  t('page.invitations.participationStatus')
                ]}
                data={activeVisit.invitedGuests.map(guest => ({
                  id: guest.id,
                  name: guest.user.fullName,
                  actualEntry: guest.actualEntry ? new Date(guest.actualEntry).toLocaleDateString(i18n.language) : unknownText,
                  actualExit: guest.actualExit ? new Date(guest.actualExit).toLocaleDateString(i18n.language) : unknownText,
                  receptionistName: guest.receptionistName ?? unknownText,
                  participationStatus: t(`guest.${guest.participationStatus}`)
                }))}
                tooltipLabel={t('action.openGuest')}
                onOpenClick={guestId => history.push(`/invitations/${routeParams['visitId']}/guests/${guestId}`)}
              />

              <Typography className={classes.listSectionTitle} component="h2">
                {t('page.invitations.consentForms')}
              </Typography>

              <List className={classes.list}>
                {activeVisit.consentFormVersionsToAccept.map(consentFormVersion => (
                  <ListItem key={consentFormVersion.id} button onClick={() => setOpenedFormVersion(consentFormVersion)}>
                    <ListItemText primary={consentFormVersion.title} />
                    <ListItemSecondaryAction>
                      <Tooltip title={t('action.openConsentForm').toString()}>
                        <IconButton edge="end" onClick={() => setOpenedFormVersion(consentFormVersion)}>
                          <OpenInNewRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </React.Fragment>
          )}
        </Paper>
      </Container>

      {!!openedFormVersion && (
        <ConsentFormVersionDialog consentFormVersion={openedFormVersion} onClose={() => setOpenedFormVersion(null)} />
      )}
    </>
  )
}

export default InvitationDetails
