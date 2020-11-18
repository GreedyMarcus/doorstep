import React, { useEffect, useState } from 'react'
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
import useInput from '../../components/shared/useInput'
import REGEXP from '../../utils/regexp'
import { RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { activeGuestProfileSelector, fetchGuestInvitationProfile } from '../../store/visit'
import { addNotification } from '../../store/action'
import { identifierCardTypeStrings } from '../../data/enums/IdentifierCardType'
import { ConsentFormVersionDetails } from '../../data/types/ConsentForm'
import { getLocaleDateFormat } from '../../utils'

const GuestInvitationDetails: React.FC<RouteComponentProps> = ({ match: { params: routeParams } }) => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const guestProfile = useSelector(activeGuestProfileSelector)
  const [t] = useTranslation()

  const getIdentifierCardTypeIndex = () => {
    if (guestProfile) {
      const index = identifierCardTypeStrings.indexOf(guestProfile.guestDetails.identifierCardType)
      return index === -1 ? 0 : index
    }
    return 0
  }

  const [nationality, bindNationality, setNationalityRequired] = useInput(guestProfile?.guestDetails.nationality || '', false)
  const [phoneNumber, bindPhoneNumber, setPhoneNumberRequired] = useInput(
    guestProfile?.guestDetails.phoneNumber || '',
    false,
    REGEXP.PHONE_NUMBER
  )
  const [birthplace, bindBirthplace, setBirthplaceRequired] = useInput(guestProfile?.guestDetails.birthplace || '', false)
  const [birthDate, setBirthDate] = useState(guestProfile?.guestDetails.birthDate as Date | null)

  const [motherName, bindMotherName, setMotherNameRequired] = useInput(guestProfile?.guestDetails.motherName || '', false)
  const [identifierCardType, setIdentifierCardType] = useState(getIdentifierCardTypeIndex())
  const [identifierCardNumber, bindIdentifierCardNumber] = useInput(guestProfile?.guestDetails.identifierCardNumber || '', false)

  const guestAddress = guestProfile?.guestDetails.address?.split(', ')

  const [country, bindCountry, setCountryRequired] = useInput(guestAddress ? guestAddress[0] : '', false)
  const [zipCode, bindZipCode, setZipCodeRequired] = useInput(guestAddress ? guestAddress[1] : '', false)
  const [city, bindCity, setCityRequired] = useInput(guestAddress ? guestAddress[2] : '', false)
  const [streetAddress, bindStreetAddress, setStreetAddressRequired] = useInput(guestAddress ? guestAddress[3] : '', false)

  const [companyName, bindCompanyName, setCompanyNameRequired] = useInput(guestProfile?.guestDetails.company?.name || '', false)
  const [regNumber, bindRegNumber, setRegNumberRequired] = useInput(
    guestProfile?.guestDetails.company?.registrationNumber || '',
    false,
    REGEXP.REGISTRATION_NUMBER
  )

  const companyAddress = guestProfile?.guestDetails.company?.address?.split(', ')

  const [companyCountry, bindCompanyCountry, setCompanyCountryRequired] = useInput(companyAddress ? companyAddress[0] : '', false)
  const [companyZipCode, bindCompanyZipCode, setCompanyZipCodeRequired] = useInput(companyAddress ? companyAddress[0] : '', false)
  const [companyCity, bindCompanyCity, setCompanyCityRequired] = useInput(companyAddress ? companyAddress[0] : '', false)
  const [companyStreetAddress, bindCompanyStreetAddress, setCompanyStreetAddressRequired] = useInput(
    companyAddress ? companyAddress[0] : '',
    false
  )

  const [openedFormVersion, setOpenedFormVersion] = useState(null as ConsentFormVersionDetails | null)
  const [checked, setChecked] = React.useState(guestProfile?.consentFormVersionsAccepted || ([] as number[]))

  const toggle = (value: number) => {
    const newChecked = [...checked]
    const currentIndex = checked.indexOf(value)

    currentIndex === -1 ? newChecked.push(value) : newChecked.splice(currentIndex, 1)
    setChecked(newChecked)
  }

  const isGuestProfileDataValid = (): boolean => {
    const inputFieldsValid = [
      nationality,
      phoneNumber,
      birthplace,
      motherName,
      country,
      zipCode,
      city,
      streetAddress,
      companyName,
      regNumber,
      companyCountry,
      companyZipCode,
      companyCity,
      companyStreetAddress
    ].every(param => param.isValid)

    return !!guestProfile?.companyRegisterConfig.storeBirthDate ? inputFieldsValid && !!birthDate : inputFieldsValid
  }

  const handleSave = () => {
    if (!isGuestProfileDataValid()) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidGuestProfileData') }))
      return
    }

    alert('GUEST PROFILE DATA IS SAVED!!!')
  }

  useEffect(() => {
    dispatch(fetchGuestInvitationProfile(routeParams['visitId']))
  }, [])

  useEffect(() => {
    setNationalityRequired(!!guestProfile?.companyRegisterConfig.storeNationality)
    setPhoneNumberRequired(!!guestProfile?.companyRegisterConfig.storePhoneNumber)
    setBirthplaceRequired(!!guestProfile?.companyRegisterConfig.storeBirthplace)
    setMotherNameRequired(!!guestProfile?.companyRegisterConfig.storeMotherName)

    setCountryRequired(!!guestProfile?.companyRegisterConfig.storeAddress)
    setZipCodeRequired(!!guestProfile?.companyRegisterConfig.storeAddress)
    setCityRequired(!!guestProfile?.companyRegisterConfig.storeAddress)
    setStreetAddressRequired(!!guestProfile?.companyRegisterConfig.storeAddress)

    setCompanyNameRequired(!!guestProfile?.companyRegisterConfig.storeCompany)
    setRegNumberRequired(!!guestProfile?.companyRegisterConfig.storeCompany)
    setCompanyCountryRequired(!!guestProfile?.companyRegisterConfig.storeCompany)
    setCompanyZipCodeRequired(!!guestProfile?.companyRegisterConfig.storeCompany)
    setCompanyCityRequired(!!guestProfile?.companyRegisterConfig.storeCompany)
    setCompanyStreetAddressRequired(!!guestProfile?.companyRegisterConfig.storeCompany)
  }, [guestProfile])

  const invitationData = [
    { label: t('visit.organizingCompany'), text: guestProfile?.invitationInfo.companyName || '' },
    { label: t('visit.location'), text: guestProfile?.invitationInfo.buildingAddress || '' },
    { label: t('visit.purpose'), text: guestProfile?.invitationInfo.purpose || '' },
    { label: t('visit.businessHostName'), text: guestProfile?.invitationInfo.businessHost.fullName || '' },
    { label: t('visit.businessHostEmail'), text: guestProfile?.invitationInfo.businessHost.email || '' },
    {
      label: t('visit.plannedEntry'),
      text: guestProfile ? getLocaleDateFormat(new Date(guestProfile.invitationInfo.plannedEntry)) : ''
    },
    { label: t('visit.room'), text: guestProfile?.invitationInfo.room || '' }
  ]

  const basicDataSet = [
    { binding: bindNationality, label: t('guest.nationality') },
    { binding: bindPhoneNumber, label: t('guest.phoneNumber') },
    { binding: bindBirthplace, label: t('guest.birthplace') }
  ]

  const addressDataSet = [
    { binding: bindCountry, label: t('general.country') },
    { binding: bindZipCode, label: t('general.zipCode') },
    { binding: bindCity, label: t('general.city') },
    { binding: bindStreetAddress, label: t('general.streetAddress') }
  ]

  const companyDataSet = [
    { binding: bindCompanyName, label: t('company.name') },
    { binding: bindRegNumber, label: t('company.registrationNumber') }
  ]

  const companyAddressDataSet = [
    { binding: bindCompanyCountry, label: t('general.country') },
    { binding: bindCompanyZipCode, label: t('general.zipCode') },
    { binding: bindCompanyCity, label: t('general.city') },
    { binding: bindCompanyStreetAddress, label: t('general.streetAddress') }
  ]

  return (
    <React.Fragment>
      <Container className={classes.container} component="main" maxWidth="lg">
        <Paper elevation={3}>
          <Typography className={classes.title} variant="h1">
            {t('visit.invitationDetails')}
          </Typography>

          {!guestProfile ? (
            <InfoBox text={t('visit.invitationNotFound')} type="error" />
          ) : (
            <React.Fragment>
              <Grid className={classes.grid} container spacing={2}>
                <Grid item xs={12}>
                  <Typography className={classes.sectionTitle} component="h2">
                    {t('visit.invitationData')}
                  </Typography>
                </Grid>

                {invitationData.map(({ label, text }, index) => (
                  <Grid item md={4} sm={6} xs={12} key={index}>
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
                    {t('guest.details')}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography className={classes.subSectionTitle} component="h3">
                    {t('general.basicData')}
                  </Typography>
                </Grid>

                {basicDataSet.map(({ binding, label }, index) => (
                  <Grid item md={3} sm={6} xs={12} key={`basic-set-${index}`}>
                    <TextField size="small" {...binding} label={label} variant="outlined" fullWidth />
                  </Grid>
                ))}

                <Grid item md={3} sm={6} xs={12}>
                  <LocalizedDateTimePicker
                    label={t('guest.birthDate')}
                    value={!!birthDate ? new Date(birthDate) : null}
                    onChange={date => setBirthDate(date)}
                    inputVariant="outlined"
                    size="small"
                  />
                </Grid>

                <Grid item md={6} sm={4} xs={12}>
                  <TextField size="small" {...bindMotherName} label={t('guest.motherName')} variant="outlined" fullWidth />
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
                        {t(`enum.${value}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item md={3} sm={4} xs={12}>
                  <TextField
                    size="small"
                    {...bindIdentifierCardNumber}
                    label={t('guest.identifierCardNumber')}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography className={classes.subSectionTitle} component="h3">
                    {t('general.address')}
                  </Typography>
                </Grid>

                {addressDataSet.map(({ binding, label }, index) => (
                  <Grid item md={3} sm={6} xs={12} key={`address-set-${index}`}>
                    <TextField size="small" {...binding} label={label} variant="outlined" fullWidth />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Typography className={classes.subSectionTitle} component="h3">
                    {t('company.companyDetails')}
                  </Typography>
                </Grid>

                {companyDataSet.map(({ binding, label }, index) => (
                  <Grid item sm={6} xs={12} key={`company-set-${index}`}>
                    <TextField size="small" {...binding} label={label} variant="outlined" fullWidth />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Typography className={classes.subSectionTitle} component="h3">
                    {t('company.address')}
                  </Typography>
                </Grid>

                {companyAddressDataSet.map(({ binding, label }, index) => (
                  <Grid item md={3} sm={6} xs={12} key={`company-address-set-${index}`}>
                    <TextField size="small" {...binding} label={label} variant="outlined" fullWidth />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Typography className={classes.sectionTitle} component="h2">
                    {t('visit.consentFormsToAccept')}
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

export default GuestInvitationDetails
