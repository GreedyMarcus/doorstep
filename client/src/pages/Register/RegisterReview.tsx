import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import useStyles from './useStyles'
import { OfficeBuildingRegister } from '../../data/types/OfficeBuilding'
import { useTranslation } from 'react-i18next'

interface RegisterReviewProps {
  visible: boolean
  reviewData: OfficeBuildingRegister
  onBackClick: () => void
  onRegisterClick: () => void
}

/**
 * Sub-component of the multi-step registration form.
 * It displays the office building register data for review purposes.
 */
const RegisterReview: React.FC<RegisterReviewProps> = ({ visible, reviewData, onBackClick, onRegisterClick }) => {
  const classes = useStyles()
  const [t] = useTranslation()

  const adminData = [
    { labelLanguageKey: 'common.email', value: reviewData.admin.email },
    { labelLanguageKey: 'common.firstName', value: reviewData.admin.firstName },
    { labelLanguageKey: 'common.lastName', value: reviewData.admin.lastName }
  ]

  const buildingAddressData = [
    { labelLanguageKey: 'common.country', value: reviewData.address.country },
    { labelLanguageKey: 'common.zipCode', value: reviewData.address.zipCode },
    { labelLanguageKey: 'common.city', value: reviewData.address.city },
    { labelLanguageKey: 'common.streetAddress', value: reviewData.address.streetAddress }
  ]

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <Typography className={classes.title} component="h1">
        {t('page.register.review')}
      </Typography>

      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <Typography variant="h2" className={classes.sectionTitle}>
            {t('page.register.adminDetails')}
          </Typography>

          {adminData.map(({ labelLanguageKey, value }) => (
            <Typography className={classes.item} gutterBottom key={labelLanguageKey}>
              <span className={classes.bold}>{t(labelLanguageKey)}:</span> {value}
            </Typography>
          ))}
        </Grid>

        <Grid item sm={6} xs={12}>
          <Typography variant="h2" className={classes.sectionTitle}>
            {t('page.register.buildingDetails')}
          </Typography>

          {buildingAddressData.map(({ labelLanguageKey, value }) => (
            <Typography className={classes.item} gutterBottom key={labelLanguageKey}>
              <span className={classes.bold}>{t(labelLanguageKey)}:</span> {value}
            </Typography>
          ))}
        </Grid>

        <Grid className={classes.buttons} container justify="flex-end">
          <Button className={classes.button} onClick={onBackClick}>
            {t('action.back')}
          </Button>
          <Button className={classes.button} variant="contained" color="primary" onClick={onRegisterClick}>
            {t('page.register.submit')}
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default RegisterReview
