import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import LocalizedDateTimePicker from '../../../components/shared/LocalizedDateTimePicker'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import useStyles from '../useStyles'
import useBasicData from './useBasicData'
import { CompanyConfig } from '../../../data/types/Company'
import { VisitGuestDetails, GuestBasicFormData } from '../../../data/types/Visit'
import { identifierCardTypeStrings } from '../../../data/enums/IdentifierCardType'
import { useTranslation } from 'react-i18next'

interface BasicDataProps {
  visible: boolean
  config: CompanyConfig | undefined
  guestDetails: VisitGuestDetails | undefined
  onNextClick: (basicData: GuestBasicFormData) => void
}

/**
 * Sub-component of the multi-step entry process form.
 * It handles the basic data belongs to the guest user, including validation.
 */
const BasicData: React.FC<BasicDataProps> = ({ visible, config, guestDetails, onNextClick }) => {
  const classes = useStyles()

  const [t] = useTranslation()
  const [
    bindNationality,
    bindPhoneNumber,
    bindBirthplace,
    birthDate,
    setBirthDate,
    bindMotherName,
    identifierCardType,
    setIdentifierCardType,
    bindIdentifierCardNumber,
    bindCountry,
    bindZipCode,
    bindCity,
    bindStreetAddress,
    handleNextClick
  ] = useBasicData({ config, guestDetails, onNextClick })

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <form onSubmit={handleNextClick} noValidate autoComplete="off">
        <Grid container spacing={2} className={classes.grid}>
          <Grid item xs={12}>
            <Typography className={classes.sectionTitle} component="h3">
              {t('common.basicData')}
            </Typography>
          </Grid>

          <Grid item md={3} sm={6} xs={12}>
            <TextField {...bindNationality} label={t('common.nationality')} variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <TextField {...bindPhoneNumber} label={t('common.phoneNumber')} variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <TextField {...bindBirthplace} label={t('common.birthplace')} variant="outlined" size="small" fullWidth />
          </Grid>
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
            <TextField {...bindMotherName} label={t('common.motherName')} variant="outlined" size="small" fullWidth />
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
              {...bindIdentifierCardNumber}
              label={t('common.identifierCardNumber')}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Typography className={classes.sectionTitle} component="h3">
              {t('common.address')}
            </Typography>
          </Grid>

          <Grid item md={3} sm={6} xs={12}>
            <TextField {...bindCountry} label={t('common.country')} variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <TextField {...bindZipCode} label={t('common.zipCode')} variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <TextField {...bindCity} label={t('common.city')} variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <TextField {...bindStreetAddress} label={t('common.streetAddress')} variant="outlined" size="small" fullWidth />
          </Grid>

          <Grid className={classes.buttons} container justify="flex-end">
            <Button className={classes.button} variant="contained" color="primary" type="submit">
              {t('action.next')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default BasicData
