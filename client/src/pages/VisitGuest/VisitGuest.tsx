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

/**
 * The visit guest page where the current visit guest is displayed.
 */
const VisitGuest: React.FC<RouteComponentProps> = ({ match: { params: routeParams } }) => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const activeGuest = useSelector(activeGuestProfileSelector)
  const [openedFormVersion, setOpenedFormVersion] = useState(null as ConsentFormVersionDetails | null)

  const isFormAccepted = (formId: number) => !!activeGuest?.consentFormVersionsAccepted.includes(formId)

  /**
   * Loads the visit guest when the component mounted.
   */
  useEffect(() => {
    dispatch(fetchVisitGuest(routeParams['visitId'], routeParams['guestId']))
  }, [])

  const unknownText = t('common.unknownData')
  const guestDetails = activeGuest?.guestDetails

  const guestBasicData = [
    { labelLanguageKey: 'page.visitsDetails.guestName', value: guestDetails?.user.fullName },
    { labelLanguageKey: 'common.email', value: guestDetails?.user.email },
    { labelLanguageKey: 'common.phoneNumber', value: guestDetails?.phoneNumber || unknownText },
    { labelLanguageKey: 'common.nationality', value: guestDetails?.nationality || unknownText },
    { labelLanguageKey: 'common.birthplace', value: guestDetails?.birthplace || unknownText },
    {
      labelLanguageKey: 'common.birthDate',
      value: guestDetails?.birthDate ? getLocaleDateFormat(new Date(guestDetails.birthDate)) : unknownText
    },
    { labelLanguageKey: 'common.motherName', value: guestDetails?.motherName || unknownText },
    { labelLanguageKey: 'common.address', value: guestDetails?.address || unknownText },
    {
      labelLanguageKey: 'common.identifierCardType',
      value: guestDetails?.identifierCardType ? t(`enum.${guestDetails.identifierCardType}`) : unknownText
    },
    { labelLanguageKey: t('common.identifierCardNumber'), value: guestDetails?.identifierCardNumber || unknownText }
  ]

  const guestCompanyData = [
    { labelLanguageKey: 'page.visitDetails.companyName', value: guestDetails?.company?.name || unknownText },
    {
      labelLanguageKey: 'page.visitDetails.companyRegistrationNumber',
      value: guestDetails?.company?.registrationNumber || unknownText
    },
    { labelLanguageKey: 'page.visitDetails.companyAddress', value: guestDetails?.company?.address || unknownText }
  ]

  const guestVisitData = [
    {
      labelLanguageKey: 'page.visitDetails.actualEntry',
      value: guestDetails?.actualEntry ? getLocaleDateFormat(new Date(guestDetails.actualEntry)) : unknownText
    },
    {
      labelLanguageKey: 'page.visitDetails.actualExit',
      value: guestDetails?.actualExit ? getLocaleDateFormat(new Date(guestDetails.actualExit)) : unknownText
    },
    { labelLanguageKey: 'page.visitDetails.receptionistName', value: guestDetails?.receptionistName || unknownText },
    {
      labelLanguageKey: 'page.visitDetails.participationStatus',
      value: guestDetails?.participationStatus ? t(`enum.${guestDetails.participationStatus}`) : unknownText
    }
  ]

  return (
    <>
      <Container className={classes.container} component="main" maxWidth="lg">
        <Paper elevation={3}>
          <Grid container>
            <Grid item sm={10} xs={9}>
              <Typography className={classes.title} variant="h1">
                {t('page.visitDetails.guest')}
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
            <InfoBox text={t('page.visitDetails.guestNotFound')} type="error" />
          ) : (
            <>
              <Grid className={classes.grid} container spacing={2}>
                <Grid item xs={12}>
                  <Typography className={classes.sectionTitle} component="h2">
                    {t('page.visitDetails.guestDetails')}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography className={classes.subSectionTitle} component="h3">
                    {t('common.basicData')}
                  </Typography>
                  <Divider />
                </Grid>

                {guestBasicData.map(({ labelLanguageKey, value }) => (
                  <Grid item md={3} sm={6} xs={12} key={labelLanguageKey}>
                    <Typography className={classes.label} component="label">
                      {t(labelLanguageKey)}
                    </Typography>
                    <Typography className={classes.text} component="h2">
                      {value}
                    </Typography>
                  </Grid>
                ))}

                <Divider />

                <Grid item xs={12}>
                  <Typography className={classes.subSectionTitle} component="h3">
                    {t('page.visitDetails.companyDetails')}
                  </Typography>
                  <Divider />
                </Grid>

                {guestCompanyData.map(({ labelLanguageKey, value }) => (
                  <Grid item md={3} sm={6} xs={12} key={labelLanguageKey}>
                    <Typography className={classes.label} component="label">
                      {t(labelLanguageKey)}
                    </Typography>
                    <Typography className={classes.text} component="h2">
                      {value}
                    </Typography>
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Typography className={classes.subSectionTitle} component="h3">
                    {t('page.visitDetails.visitData')}
                  </Typography>
                  <Divider />
                </Grid>

                {guestVisitData.map(({ labelLanguageKey, value }) => (
                  <Grid item md={3} sm={6} xs={12} key={labelLanguageKey}>
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
                    {t('page.visitDetails.consentFormsToAccept')}
                  </Typography>
                </Grid>
              </Grid>

              <List className={classes.list}>
                {activeGuest.consentFormVersionsToAccept.map(consentFormVersion => (
                  <ListItem key={consentFormVersion.id} button onClick={() => setOpenedFormVersion(consentFormVersion)}>
                    <ListItemIcon>
                      {isFormAccepted(consentFormVersion.id) ? (
                        <Tooltip title={t('page.visitDetails.consentFormAccepted').toString()}>
                          <CheckCircleRoundedIcon color="secondary" />
                        </Tooltip>
                      ) : (
                        <Tooltip title={t('page.visitDetails.consentFormNotAccepted').toString()}>
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
            </>
          )}
        </Paper>
      </Container>

      {!!openedFormVersion && (
        <ConsentFormVersionDialog consentFormVersion={openedFormVersion} onClose={() => setOpenedFormVersion(null)} />
      )}
    </>
  )
}

export default VisitGuest
