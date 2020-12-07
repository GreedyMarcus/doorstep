import React, { useState } from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import InfoBox from '../../components/shared/InfoBox'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import LocalizedDateTimePicker from '../../components/shared/LocalizedDateTimePicker'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded'
import ConsentFormVersionDialog from '../../components/ConsentFormVersionDialog'
import Button from '@material-ui/core/Button'
import useStyles from './useStyles'
import useGuestInvitationDetails from './useGuestInvitationDetails'
import { useTranslation } from 'react-i18next'
import { identifierCardTypeStrings } from '../../data/enums/IdentifierCardType'
import { ConsentFormVersionDetails } from '../../data/types/ConsentForm'
import { GuestInvitationDetails as GuestInvitationDetailsProp } from '../../data/types/Visit'

interface GuestInvitationDetailsProps {
  visitId: number
  guestProfile: GuestInvitationDetailsProp | null
}

/**
 * The guest invitation details page where the current guest invitation is displayed.
 */
const GuestInvitationDetails: React.FC<GuestInvitationDetailsProps> = ({ visitId, guestProfile }) => {
  const classes = useStyles()

  const [openedFormVersion, setOpenedFormVersion] = useState(null as ConsentFormVersionDetails | null)

  const [t] = useTranslation()
  const [
    invitationData,
    basicData,
    birthDate,
    setBirthDate,
    bindMotherName,
    identifierCardType,
    setIdentifierCardType,
    bindIdentifierCardNumber,
    addressData,
    companyData,
    companyAddressData,
    toggle,
    checked,
    handleSave
  ] = useGuestInvitationDetails({ visitId, guestProfile })

  return (
    <>
      <Container className={classes.container} component="main" maxWidth="lg">
        <Paper elevation={3}>
          <Typography className={classes.title} variant="h1">
            {t('page.guestInvitations.invitationDetails')}
          </Typography>

          {!guestProfile ? (
            <InfoBox text={t('page.guestInvitations.invitationNotFound')} type="error" />
          ) : (
            <>
              <Grid className={classes.grid} container spacing={2}>
                <Grid item xs={12}>
                  <Typography className={classes.sectionTitle} component="h2">
                    {t('page.guestInvitations.invitationData')}
                  </Typography>
                </Grid>

                {invitationData.map(({ labelLanguageKey, value }) => (
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
                    {t('page.guestInvitations.guestDetails')}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography className={classes.subSectionTitle} component="h3">
                    {t('common.basicData')}
                  </Typography>
                </Grid>

                {basicData.map(({ labelLanguageKey, binding }) => (
                  <Grid item md={3} sm={6} xs={12} key={`basic-${labelLanguageKey}`}>
                    <TextField size="small" {...binding} label={t(labelLanguageKey)} variant="outlined" fullWidth />
                  </Grid>
                ))}

                <Grid item md={3} sm={6} xs={12}>
                  <LocalizedDateTimePicker
                    label={t('common.birthDate')}
                    value={!!birthDate ? new Date(birthDate) : null}
                    onChange={date => setBirthDate(date)}
                    inputVariant="outlined"
                    size="small"
                  />
                </Grid>

                <Grid item md={6} sm={4} xs={12}>
                  <TextField size="small" {...bindMotherName} label={t('common.motherName')} variant="outlined" fullWidth />
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <Select
                    className={classes.select}
                    fullWidth
                    variant="outlined"
                    value={identifierCardType}
                    onChange={e => setIdentifierCardType(Number(e.target.value))}
                  >
                    {identifierCardTypeStrings.map((value, index) => (
                      <MenuItem key={value} value={index}>
                        {t(`enum.identifierCardType.${value}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <TextField
                    size="small"
                    {...bindIdentifierCardNumber}
                    label={t('common.identifierCardNumber')}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography className={classes.subSectionTitle} component="h3">
                    {t('common.address')}
                  </Typography>
                </Grid>

                {addressData.map(({ labelLanguageKey, binding }) => (
                  <Grid item md={3} sm={6} xs={12} key={`address-${labelLanguageKey}`}>
                    <TextField size="small" {...binding} label={t(labelLanguageKey)} variant="outlined" fullWidth />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Typography className={classes.subSectionTitle} component="h3">
                    {t('page.guestInvitations.companyDetails')}
                  </Typography>
                </Grid>

                {companyData.map(({ labelLanguageKey, binding }) => (
                  <Grid item sm={6} xs={12} key={`company-${labelLanguageKey}`}>
                    <TextField size="small" {...binding} label={t(labelLanguageKey)} variant="outlined" fullWidth />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Typography className={classes.subSectionTitle} component="h3">
                    {t('page.guestInvitations.companyAddress')}
                  </Typography>
                </Grid>

                {companyAddressData.map(({ labelLanguageKey, binding }) => (
                  <Grid item md={3} sm={6} xs={12} key={`company-address-${labelLanguageKey}`}>
                    <TextField size="small" {...binding} label={t(labelLanguageKey)} variant="outlined" fullWidth />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Typography className={classes.sectionTitle} component="h2">
                    {t('page.guestInvitations.consentFormsToAccept')}
                  </Typography>
                </Grid>
              </Grid>

              <List className={classes.list}>
                {guestProfile.consentFormVersionsToAccept.map(consentFormVersion => (
                  <ListItem key={consentFormVersion.id}>
                    <ListItemIcon onClick={() => toggle(consentFormVersion.id)}>
                      <Tooltip title={t('action.acceptConsentForm').toString()}>
                        <Checkbox className={classes.checkbox} checked={checked.indexOf(consentFormVersion.id) !== -1} />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText primary={consentFormVersion.title} onClick={() => setOpenedFormVersion(consentFormVersion)} />
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
                <Button variant="contained" color="primary" onClick={handleSave}>
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

export default GuestInvitationDetails
