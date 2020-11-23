import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import InfoBox from '../../components/shared/InfoBox'
import Grid from '@material-ui/core/Grid'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import GuestTableRow from '../../components/GuestTableRow'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded'
import ConsentFormVersionDialog from '../../components/ConsentFormVersionDialog'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { activeVisitSelector, fetchVisitById } from '../../store/visit'
import { ConsentFormVersionDetails } from '../../data/types/ConsentForm'
import { getLocaleDateFormat } from '../../utils'

/**
 * The visit details page where the current visit is displayed.
 */
const VisitDetails: React.FC<RouteComponentProps> = ({ match: { params: routeParams } }) => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const showMore = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
  const activeVisit = useSelector(activeVisitSelector)

  const [openedFormVersion, setOpenedFormVersion] = useState(null as ConsentFormVersionDetails | null)

  /**
   * Loads the visits when the component mounted.
   */
  useEffect(() => {
    dispatch(fetchVisitById(routeParams['visitId']))
  }, [])

  const visitData = [
    { labelLanguageKey: 'page.visitDetails.companyName', value: activeVisit?.companyName || '' },
    { labelLanguageKey: 'page.visitDetails.businessHostName', value: activeVisit?.businessHost.fullName || '' },
    { labelLanguageKey: 'page.visitDetails.businessHostEmail', value: activeVisit?.businessHost.email || '' },
    { labelLanguageKey: 'page.visitDetails.purpose', value: activeVisit?.purpose || '' },
    { labelLanguageKey: 'common.room', value: activeVisit?.room || '' },
    {
      labelLanguageKey: 'page.visitDetails.plannedEntry',
      value: activeVisit ? getLocaleDateFormat(new Date(activeVisit.plannedEntry)) : ''
    }
  ]

  return (
    <>
      <Container className={classes.container} component="main" maxWidth="lg">
        <Paper elevation={3}>
          <Typography className={classes.title} variant="h1">
            {t('page.visit.details')}
          </Typography>

          {!activeVisit ? (
            <InfoBox text={t('page.visitDetails.notFound')} type="error" />
          ) : (
            <>
              <Grid className={classes.grid} container spacing={2}>
                <Grid item xs={12}>
                  <Typography className={classes.sectionTitle} component="h2">
                    {t('page.visitDetails.visitData')}
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
                    {t('page.visitDetails.guests')}
                  </Typography>
                </Grid>
              </Grid>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.emptyCell} />
                      <TableCell className={classes.tableCell}>{t('page.visitDetails.guestName')}</TableCell>
                      {showMore && (
                        <React.Fragment>
                          <TableCell className={classes.tableCell}>{t('page.visitDetails.actualEntry')}</TableCell>
                          <TableCell className={classes.tableCell}>{t('page.visitDetails.actualExit')}</TableCell>
                          <TableCell className={classes.tableCell}>{t('page.visitDetails.receptionistName')}</TableCell>
                          <TableCell className={classes.tableCell}>{t('page.visitDetails.participationStatus')}</TableCell>
                        </React.Fragment>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeVisit.invitedGuests.map(guest => (
                      <GuestTableRow key={guest.id} guest={guest} showMore={showMore} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography className={classes.listSectionTitle} component="h2">
                {t('page.visitDetails.consentForms')}
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

export default VisitDetails
