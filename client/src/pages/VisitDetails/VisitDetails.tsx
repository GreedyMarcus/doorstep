import React, { useState } from 'react'
import Widget from '../../components/shared/Widget'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import ResponsiveTableHead from '../../components/shared/ResponsiveTableHead'
import TableBody from '@material-ui/core/TableBody'
import CollapsibleTableRow from '../../components/shared/CollapsibleTableRow'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded'
import ConsentFormVersionDialog from '../../components/ConsentFormVersionDialog'
import useStyles from './useStyles'
import useVisitDetails from './useVisitDetails'
import { ConsentFormVersionDetails } from '../../data/types/ConsentForm'
import { RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * The visit details page where the current visit is displayed.
 */
const VisitDetails: React.FC<RouteComponentProps> = ({ match: { params: routeParams } }) => {
  const classes = useStyles()

  const [t] = useTranslation()
  const [openedFormVersion, setOpenedFormVersion] = useState(null as ConsentFormVersionDetails | null)
  const [activeVisit, visitData, getGuestLabels, getBasicData, getAdditionalData] = useVisitDetails({
    visitId: routeParams['visitId']
  })

  return (
    <>
      <Widget
        title={t('page.visits.details')}
        showContent={!!activeVisit}
        hasContent={!!activeVisit}
        infoText={t('page.visitDetails.notFound')}
      >
        <>
          <Grid className={classes.grid} container spacing={2}>
            <Grid item xs={12}>
              <Typography className={classes.firstSectionTitle} component="h2">
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

          <TableContainer className={classes.tableContainer}>
            <Table>
              <ResponsiveTableHead
                labels={[
                  t('page.visitDetails.guestName'),
                  t('page.visitDetails.actualEntry'),
                  t('page.visitDetails.actualExit'),
                  t('page.visitDetails.receptionistName'),
                  t('page.visitDetails.participationStatus')
                ]}
                emptyStart
              />
              <TableBody>
                {activeVisit?.invitedGuests.map(guest => (
                  <CollapsibleTableRow key={guest.id} labels={getGuestLabels(guest)}>
                    <Grid container className={classes.tableRowGrid}>
                      <Grid item xs={12}>
                        <Typography className={classes.tableRowContentTitle} component="h1">
                          {t('page.visitDetails.guestDetails')}
                        </Typography>
                      </Grid>
                      <Grid className={classes.tableRowItem} item sm={6} xs={12}>
                        <Typography variant="h2" className={classes.tableRowSectionTitle}>
                          {t('common.basicData')}
                        </Typography>

                        {getBasicData(guest).map(({ labelLanguageKey, value }) => (
                          <Typography className={classes.tableRowItem} gutterBottom key={labelLanguageKey}>
                            <span className={classes.bold}>{t(labelLanguageKey)}:</span> {value}
                          </Typography>
                        ))}
                      </Grid>
                      <Grid className={classes.tableRowItem} item sm={6} xs={12}>
                        <Typography variant="h2" className={classes.tableRowSectionTitle}>
                          {t('common.additionalData')}
                        </Typography>

                        {getAdditionalData(guest).map(({ labelLanguageKey, value }) => (
                          <Typography className={classes.tableRowItem} gutterBottom key={labelLanguageKey}>
                            <span className={classes.bold}>{t(labelLanguageKey)}:</span> {value}
                          </Typography>
                        ))}
                      </Grid>
                    </Grid>
                  </CollapsibleTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography className={classes.listSectionTitle} component="h2">
            {t('page.visitDetails.consentForms')}
          </Typography>
          <List className={classes.list}>
            {activeVisit?.consentFormVersionsToAccept.map(consentFormVersion => (
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
      </Widget>

      {!!openedFormVersion && (
        <ConsentFormVersionDialog consentFormVersion={openedFormVersion} onClose={() => setOpenedFormVersion(null)} />
      )}
    </>
  )
}

export default VisitDetails
