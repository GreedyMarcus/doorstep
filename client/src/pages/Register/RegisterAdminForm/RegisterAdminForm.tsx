import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import useStyles from './useStyles'
import { InputBinding } from '../../../components/shared/useInput'

type Props = {
  emailBinding: InputBinding
  passwordBinding: InputBinding
  firstNameBinding: InputBinding
  lastNameBinding: InputBinding
}

const RegisterAdminForm: React.FC<Props> = ({
  emailBinding,
  passwordBinding,
  firstNameBinding,
  lastNameBinding
}) => {
  const classes = useStyles()

  return (
    <React.Fragment>
      <Typography className={classes.title} component="h1">
        Admin details
      </Typography>
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <TextField
            {...emailBinding}
            id="admin-details-email"
            label="Email Address"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            {...passwordBinding}
            id="admin-details-password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            {...firstNameBinding}
            id="admin-details-first-name"
            label="First Name"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            {...lastNameBinding}
            id="admin-details-last-name"
            label="Last Name"
            variant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default RegisterAdminForm
