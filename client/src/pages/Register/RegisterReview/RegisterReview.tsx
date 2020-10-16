import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import useStyles from './useStyles'

type Props = {
  email: string
  firstName: string
  lastName: string
  country: string
  zipCode: string
  city: string
  streetAddress: string
  visible: boolean
}

const RegisterAdminForm: React.FC<Props> = ({
  email,
  firstName,
  lastName,
  country,
  zipCode,
  city,
  streetAddress,
  visible
}) => {
  const classes = useStyles({ visible })

  return (
    <div className={classes.wrapper}>
      <Typography className={classes.title} component="h1">
        Review registration
      </Typography>
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <Typography variant="h2" className={classes.sectionTitle}>
            Admin details
          </Typography>
          <Typography className={classes.item} gutterBottom>{`Email: ${email}`}</Typography>
          <Typography
            className={classes.item}
            gutterBottom
          >{`First Name: ${firstName}`}</Typography>
          <Typography className={classes.item} gutterBottom>{`Last Name: ${lastName}`}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography variant="h2" className={classes.sectionTitle}>
            Office building details
          </Typography>
          <Typography className={classes.item} gutterBottom>{`Country: ${country}`}</Typography>
          <Typography className={classes.item} gutterBottom>{`Zip Code: ${zipCode}`}</Typography>
          <Typography className={classes.item} gutterBottom>{`City: ${city}`}</Typography>
          <Typography
            className={classes.item}
            gutterBottom
          >{`Street Address: ${streetAddress}`}</Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default RegisterAdminForm
