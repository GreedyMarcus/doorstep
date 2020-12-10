import blueGrey from '@material-ui/core/colors/blueGrey'
import { makeStyles } from '@material-ui/core/styles'

/**
 * Custom React hook that spearates the Login page styling.
 */
export default makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  icon: {
    fontSize: 75,
    color: blueGrey[400]
  },
  welcome: {
    fontSize: 26,
    fontWeight: 600,
    marginTop: theme.spacing(1)
  },
  welcomeHelper: {
    fontSize: 16,
    color: blueGrey[300]
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  forgotPasswordLink: {
    padding: `${theme.spacing(0.5, 1.5)} !important` as string // Workaround to use !important
  },
  submit: {
    marginBottom: theme.spacing(2)
  }
}))
