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
import useInput from '../../components/hooks/useInput'
import REGEXP from '../../utils/regexp'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../../store'
import { updateGuestInvitationProfile } from '../../store/visit'
import { addNotification } from '../../store/action'
import { identifierCardTypeStrings } from '../../data/enums/IdentifierCardType'
import { ConsentFormVersionDetails } from '../../data/types/ConsentForm'
import { GuestInvitationDetails as GuestInvitationDetailsProp, GuestUpdateByUser } from '../../data/types/Visit'
import { getLocaleDateFormat } from '../../utils'

interface GuestInvitationDetailsProps {
  visitId: number
  guestProfile: GuestInvitationDetailsProp | null
}

const GuestInvitationDetails: React.FC<GuestInvitationDetailsProps> = ({ visitId, guestProfile }) => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  /**
   * Helper function to get identifier card type index for local state.
   */
  const getIdentifierCardTypeIndex = () => {
    if (guestProfile) {
      const index = identifierCardTypeStrings.indexOf(guestProfile.guestDetails.identifierCardType)
      return index === -1 ? 0 : index
    }
    return 0
  }

  const [nationality, bindNationality] = useInput({ initialValue: guestProfile?.guestDetails.nationality })
  const [phoneNumber, bindPhoneNumber] = useInput({
    initialValue: guestProfile?.guestDetails.phoneNumber,
    validator: REGEXP.PHONE_NUMBER
  })
  const [birthplace, bindBirthplace] = useInput({ initialValue: guestProfile?.guestDetails.birthplace })
  const [birthDate, setBirthDate] = useState(
    guestProfile?.guestDetails?.birthDate ? new Date(guestProfile.guestDetails.birthDate) : null
  )

  const [motherName, bindMotherName] = useInput({ initialValue: guestProfile?.guestDetails.motherName })
  const [identifierCardType, setIdentifierCardType] = useState(getIdentifierCardTypeIndex())
  const [identifierCardNumber, bindIdentifierCardNumber] = useInput({
    initialValue: guestProfile?.guestDetails.identifierCardNumber
  })

  const guestAddress = guestProfile?.guestDetails.address?.split(', ')

  const [country, bindCountry] = useInput({ initialValue: guestAddress && guestAddress[0] })
  const [zipCode, bindZipCode] = useInput({ initialValue: guestAddress && guestAddress[1] })
  const [city, bindCity] = useInput({ initialValue: guestAddress && guestAddress[2] })
  const [streetAddress, bindStreetAddress] = useInput({ initialValue: guestAddress && guestAddress[3] })

  const [companyName, bindCompanyName] = useInput({ initialValue: guestProfile?.guestDetails.company?.name })
  const [regNumber, bindRegNumber] = useInput({
    initialValue: guestProfile?.guestDetails.company?.registrationNumber,
    validator: REGEXP.REGISTRATION_NUMBER
  })

  const companyAddress = guestProfile?.guestDetails.company?.address?.split(', ')

  const [companyCountry, bindCompanyCountry] = useInput({ initialValue: companyAddress && companyAddress[0] })
  const [companyZipCode, bindCompanyZipCode] = useInput({ initialValue: companyAddress && companyAddress[1] })
  const [companyCity, bindCompanyCity] = useInput({ initialValue: companyAddress && companyAddress[2] })
  const [companyStreetAddress, bindCompanyStreetAddress] = useInput({ initialValue: companyAddress && companyAddress[4] })

  const [openedFormVersion, setOpenedFormVersion] = useState(null as ConsentFormVersionDetails | null)
  const [checked, setChecked] = useState(guestProfile?.consentFormVersionsAccepted || ([] as number[]))

  /**
   * Switches the state of the checkbox
   */
  const toggle = (value: number) => {
    const newChecked = [...checked]
    const currentIndex = checked.indexOf(value)

    currentIndex === -1 ? newChecked.push(value) : newChecked.splice(currentIndex, 1)
    setChecked(newChecked)
  }

  /**
   * Validates the guest user data.
   */
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
    ].every(param => param.valid)

    return !!guestProfile?.companyRegisterConfig.storeBirthDate ? inputFieldsValid && !!birthDate : inputFieldsValid
  }

  /**
   * Validates if guest provided all of the address properties.
   */
  const isGuestAddressApproved = (): boolean => {
    const addressInputs = [country, zipCode, city, streetAddress]
    if (addressInputs.some(input => !!input.value)) {
      return addressInputs.every(input => !!input.value)
    }
    return true
  }

  /**
   * Validates if guest provided all of the company properties.
   */
  const isCompanyDataApproved = (): boolean => {
    const companyInputs = [companyName, regNumber, companyCountry, companyZipCode, companyCity, companyStreetAddress]
    if (companyInputs.some(input => !!input.value)) {
      return companyInputs.every(input => !!input.value)
    }
    return true
  }

  /**
   * Saves guest profile data.
   */
  const handleSave = () => {
    if (!isGuestProfileDataValid()) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidGuestProfileData') }))
      return
    }

    // Only full guest address data approved
    if (!isGuestAddressApproved()) {
      dispatch(addNotification({ type: 'warning', message: t('notification.provideFullAddressDataWarning') }))
      return
    }

    // Only full company data approved
    if (!isCompanyDataApproved()) {
      dispatch(addNotification({ type: 'warning', message: t('notification.provideFullCompanyDataWarning') }))
      return
    }

    const profileData: GuestUpdateByUser = {
      nationality: !!nationality.value ? nationality.value : null,
      phoneNumber: !!phoneNumber.value ? phoneNumber.value : null,
      birthplace: !!birthplace.value ? birthplace.value : null,
      birthDate: birthDate ? birthDate.toISOString() : null,
      motherName: !!motherName.value ? motherName.value : null,
      address: !country.value
        ? null
        : {
            // we already know if all of the address data is provided
            country: country.value,
            zipCode: zipCode.value,
            city: city.value,
            streetAddress: streetAddress.value
          },
      identifierCardType: identifierCardTypeStrings[identifierCardType],
      identifierCardNumber: !!identifierCardNumber.value ? identifierCardNumber.value : null,
      company: !companyName.value
        ? null
        : {
            // we already know if all of the company data is provided
            name: companyName.value,
            registrationNumber: regNumber.value,
            address: {
              country: companyCountry.value,
              zipCode: companyZipCode.value,
              city: companyCity.value,
              streetAddress: companyStreetAddress.value
            }
          },
      imageUrl: null,
      signatureImageUrl: null,
      consentFormVersionsAccepted: checked
    }

    dispatch(updateGuestInvitationProfile(visitId, profileData))
  }

  const invitationInfo = guestProfile?.invitationInfo
  const invitationData = [
    { labelLanguageKey: 'page.guestInvitations.organizingCompany', value: invitationInfo?.companyName || '' },
    { labelLanguageKey: 'page.guestInvitations.location', value: invitationInfo?.buildingAddress || '' },
    { labelLanguageKey: 'page.guestInvitations.purpose', value: invitationInfo?.purpose || '' },
    { labelLanguageKey: 'page.guestInvitations.businessHostName', value: invitationInfo?.businessHost.fullName || '' },
    { labelLanguageKey: 'page.guestInvitations.businessHostEmail', value: invitationInfo?.businessHost.email || '' },
    {
      labelLanguageKey: 'page.guestInvitations.plannedEntry',
      value: invitationInfo ? getLocaleDateFormat(new Date(invitationInfo.plannedEntry)) : ''
    },
    { labelLanguageKey: 'common.room', value: invitationInfo?.room || '' }
  ]

  const basicData = [
    { labelLanguageKey: 'common.nationality', binding: bindNationality },
    { labelLanguageKey: 'common.phoneNumber', binding: bindPhoneNumber },
    { labelLanguageKey: 'common.birthplace', binding: bindBirthplace }
  ]

  const addressData = [
    { labelLanguageKey: 'common.country', binding: bindCountry },
    { labelLanguageKey: 'common.zipCode', binding: bindZipCode },
    { labelLanguageKey: 'common.city', binding: bindCity },
    { labelLanguageKey: 'common.streetAddress', binding: bindStreetAddress }
  ]

  const companyData = [
    { labelLanguageKey: 'page.guestInvitations.companyName', binding: bindCompanyName },
    { labelLanguageKey: 'page.guestInvitations.companyRegistrationNumber', binding: bindRegNumber }
  ]

  const companyAddressData = [
    { labelLanguageKey: 'common.country', binding: bindCompanyCountry },
    { labelLanguageKey: 'common.zipCode', binding: bindCompanyZipCode },
    { labelLanguageKey: 'common.city', binding: bindCompanyCity },
    { labelLanguageKey: 'common.streetAddress', binding: bindCompanyStreetAddress }
  ]

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
                        {t(`enum.${value}`)}
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
