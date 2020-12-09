import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import useStyles from '../useStyles'
import useCompanyDetails from './useCompanyDetails'
import { CompanyConfig } from '../../../data/types/Company'
import { VisitGuestDetails } from '../../../data/types/Visit'
import { CompanyShortUpdate } from '../../../data/types/Company'
import { useTranslation } from 'react-i18next'

interface CompanyDetailsProps {
  visible: boolean
  config: CompanyConfig | undefined
  guestDetails: VisitGuestDetails | undefined
  onBackClick: () => void
  onNextClick: (companyDetails: CompanyShortUpdate | null) => void
}

/**
 * Sub-component of the multi-step entry process form.
 * It handles the company details belongs to the guest user, including validation.
 */
const CompanyDetails: React.FC<CompanyDetailsProps> = ({ visible, config, guestDetails, onBackClick, onNextClick }) => {
  const classes = useStyles()

  const [t] = useTranslation()
  const [
    bindCompanyName,
    bindRegNumber,
    bindCompanyCountry,
    bindCompanyZipCode,
    bindCompanyCity,
    bindCompanyStreetAddress,
    handleNextClick
  ] = useCompanyDetails({ config, guestDetails, onNextClick })

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <form onSubmit={handleNextClick} noValidate autoComplete="off">
        <Grid container spacing={2} className={classes.grid}>
          <Grid item xs={12}>
            <Typography className={classes.sectionTitle} component="h3">
              {t('page.entryProcess.companyDetails')}
            </Typography>
          </Grid>

          <Grid item sm={6} xs={12}>
            <TextField
              {...bindCompanyName}
              label={t('page.guestInvitations.companyName')}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              {...bindRegNumber}
              label={t('page.guestInvitations.companyRegistrationNumber')}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Typography className={classes.sectionTitle} component="h3">
              {t('page.guestInvitations.companyAddress')}
            </Typography>
          </Grid>

          <Grid item md={3} sm={6} xs={12}>
            <TextField {...bindCompanyCountry} label={t('common.country')} variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <TextField {...bindCompanyZipCode} label={t('common.zipCode')} variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <TextField {...bindCompanyCity} label={t('common.city')} variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <TextField
              {...bindCompanyStreetAddress}
              label={t('common.streetAddress')}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>

          <Grid className={classes.buttons} container justify="flex-end">
            <Button className={classes.button} onClick={onBackClick}>
              {t('action.back')}
            </Button>
            <Button className={classes.button} variant="contained" color="primary" type="submit">
              {t('action.next')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default CompanyDetails
