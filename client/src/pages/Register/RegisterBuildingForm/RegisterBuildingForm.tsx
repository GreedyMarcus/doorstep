import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import useStyles from './useStyles'
import { InputBinding } from '../../../components/shared/useInput'

type Props = {
  countryBinding: InputBinding
  zipCodeBinding: InputBinding
  cityBinding: InputBinding
  streetAddressBinding: InputBinding
}

const RegisterBuildingForm: React.FC<Props> = ({
  countryBinding,
  zipCodeBinding,
  cityBinding,
  streetAddressBinding
}) => {
  const classes = useStyles()

  return (
    <React.Fragment>
      <Typography className={classes.title} component="h1">
        Office building details
      </Typography>
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <TextField
            {...countryBinding}
            id="building-details-country"
            label="Country"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            {...zipCodeBinding}
            id="building-details-zip-code"
            label="Zip Code"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            {...cityBinding}
            id="building-details-city"
            label="City"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            {...streetAddressBinding}
            id="building-details-street-address"
            label="Street Address"
            variant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default RegisterBuildingForm
