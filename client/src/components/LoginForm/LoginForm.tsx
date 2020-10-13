import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import MeetingRoomRoundedIcon from '@material-ui/icons/MeetingRoomRounded'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import useStyles from './useStyles'
import useInput from '../shared/useInput'
import REGEXP from '../../utils/regexp'

type Props = {
  onLogin: (e: React.FormEvent<HTMLFormElement>) => void
}

const LoginForm: React.FC<Props> = ({ onLogin }) => {
  const classes = useStyles()
  const [email, bindEmail, resetEmail] = useInput('', true, REGEXP.EMAIL)
  const [password, bindPassword, resetPassword] = useInput('', false)

  const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    console.log(`Email: ${email}, Password: ${password}`)
    resetEmail()
  }

  return (
    <div className={classes.root}>
      <Avatar className={classes.avatar}>
        <MeetingRoomRoundedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <form className={classes.form} onSubmit={handleLogin} noValidate>
        <TextField
          {...bindEmail}
          variant="outlined"
          margin="normal"
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          {...bindPassword}
          variant="outlined"
          margin="normal"
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          size="large"
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default LoginForm
