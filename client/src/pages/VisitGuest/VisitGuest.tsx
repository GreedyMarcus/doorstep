import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import InfoBox from '../../components/shared/InfoBox'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded'
import CancelRoundedIcon from '@material-ui/icons/CancelRounded'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded'
import ConsentFormVersionDialog from '../../components/ConsentFormVersionDialog'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import useStyles from './useStyles'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { activeGuestProfileSelector, fetchVisitGuest } from '../../store/visit'
import { ConsentFormVersionDetails } from '../../data/types/ConsentForm'
import { getLocaleDateFormat } from '../../utils'

const VisitGuest: React.FC<RouteComponentProps> = ({ match: { params: routeParams } }) => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const activeGuest = useSelector(activeGuestProfileSelector)
  const [t] = useTranslation()

  const [openedFormVersion, setOpenedFormVersion] = useState(null as ConsentFormVersionDetails | null)

  const isFormAccepted = (formId: number) => !!activeGuest?.consentFormVersionsAccepted.includes(formId)

  useEffect(() => {
    dispatch(fetchVisitGuest(routeParams['visitId'], routeParams['guestId']))
  }, [])

  const unknownText = t('general.unknown')
  const guestDetails = activeGuest?.guestDetails

  const guestBasicData = [
    { label: t('guest.name'), text: guestDetails?.user.fullName },
    { label: t('auth.email'), text: guestDetails?.user.email },
    { label: t('guest.phoneNumber'), text: guestDetails?.phoneNumber || unknownText },
    { label: t('guest.nationality'), text: guestDetails?.nationality || unknownText },
    { label: t('guest.birthplace'), text: guestDetails?.birthplace || unknownText },
    {
      label: t('guest.birthDate'),
      text: guestDetails?.birthDate ? getLocaleDateFormat(new Date(guestDetails.birthDate)) : unknownText
    },
    { label: t('guest.motherName'), text: guestDetails?.motherName || unknownText },
    { label: t('general.address'), text: guestDetails?.address || unknownText },
    {
      label: t('guest.identifierCardType'),
      text: guestDetails?.identifierCardType ? t(`enum.${guestDetails.identifierCardType}`) : unknownText
    },
    { label: t('guest.identifierCardNumber'), text: guestDetails?.identifierCardNumber || unknownText }
  ]

  const guestCompanyData = [
    { label: t('company.name'), text: guestDetails?.company?.name || unknownText },
    { label: t('company.registrationNumber'), text: guestDetails?.company?.registrationNumber || unknownText },
    { label: t('company.address'), text: guestDetails?.company?.address || unknownText }
  ]

  const guestVisitData = [
    {
      label: t('guest.actualEntry'),
      text: guestDetails?.actualEntry ? getLocaleDateFormat(new Date(guestDetails.actualEntry)) : unknownText
    },
    {
      label: t('guest.actualExit'),
      text: guestDetails?.actualExit ? getLocaleDateFormat(new Date(guestDetails.actualExit)) : unknownText
    },
    { label: t('guest.receptionistName'), text: guestDetails?.receptionistName || unknownText },
    {
      label: t('guest.participationStatus'),
      text: guestDetails?.participationStatus ? t(`guest.${guestDetails.participationStatus}`) : unknownText
    }
  ]

  return (
    <React.Fragment>
      <Container className={classes.container} component="main" maxWidth="lg">
        <Paper elevation={3}>
          <Grid container>
            <Grid item sm={10} xs={9}>
              <Typography className={classes.title} variant="h1">
                {t('general.guest')}
              </Typography>
            </Grid>
            <Grid item sm={2} xs={3} className={classes.close}>
              <Tooltip title={t('action.close').toString()}>
                <IconButton onClick={() => history.push(`/invitations/${routeParams['visitId']}`)}>
                  <CloseRoundedIcon className={classes.closeIcon} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>

          {!activeGuest || !Object.values(activeGuest).length ? (
            <InfoBox text={t('guest.notFound')} type="error" />
          ) : (
            <React.Fragment>
              <Grid className={classes.grid} container spacing={2}>
                <Grid item xs={12}>
                  <Typography className={classes.sectionTitle} component="h2">
                    {t('guest.details')}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography className={classes.subSectionTitle} component="h3">
                    {t('general.basicData')}
                  </Typography>
                  <Divider />
                </Grid>

                {guestBasicData.map(({ label, text }, index) => (
                  <Grid item md={3} sm={6} xs={12} key={index}>
                    <Typography className={classes.label} component="label">
                      {label}
                    </Typography>
                    <Typography className={classes.text} component="h2">
                      {text}
                    </Typography>
                  </Grid>
                ))}

                <Divider />

                <Grid item xs={12}>
                  <Typography className={classes.subSectionTitle} component="h3">
                    {t('company.companyDetails')}
                  </Typography>
                  <Divider />
                </Grid>

                {guestCompanyData.map(({ label, text }, index) => (
                  <Grid item md={3} sm={6} xs={12} key={index}>
                    <Typography className={classes.label} component="label">
                      {label}
                    </Typography>
                    <Typography className={classes.text} component="h2">
                      {text}
                    </Typography>
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Typography className={classes.subSectionTitle} component="h3">
                    {t('visit.details')}
                  </Typography>
                  <Divider />
                </Grid>

                {guestVisitData.map(({ label, text }, index) => (
                  <Grid item md={3} sm={6} xs={12} key={index}>
                    <Typography className={classes.label} component="label">
                      {label}
                    </Typography>
                    <Typography className={classes.text} component="h2">
                      {text}
                    </Typography>
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Typography className={classes.sectionTitle} component="h2">
                    {t('visit.consentFormsToAccept')}
                  </Typography>
                </Grid>
              </Grid>

              <List className={classes.list}>
                {activeGuest.consentFormVersionsToAccept.map(consentFormVersion => (
                  <ListItem key={consentFormVersion.id} button onClick={() => setOpenedFormVersion(consentFormVersion)}>
                    <ListItemIcon>
                      {isFormAccepted(consentFormVersion.id) ? (
                        <Tooltip title={t('consentForm.accepted').toString()}>
                          <CheckCircleRoundedIcon color="secondary" />
                        </Tooltip>
                      ) : (
                        <Tooltip title={t('consentForm.notAccepted').toString()}>
                          <CancelRoundedIcon color="error" />
                        </Tooltip>
                      )}
                    </ListItemIcon>
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

              <Grid className={classes.buttons} container justify="flex-end">
                <Button variant="contained" color="primary">
                  {t('action.save')}
                </Button>
              </Grid>
            </React.Fragment>
          )}
        </Paper>
      </Container>
      {!!openedFormVersion && (
        <ConsentFormVersionDialog consentFormVersion={openedFormVersion} onClose={() => setOpenedFormVersion(null)} />
      )}
    </React.Fragment>
  )
}

export default VisitGuest
