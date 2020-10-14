import blueGrey from '@material-ui/core/colors/blueGrey'
import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(8)
  },
  paper: {
    padding: theme.spacing(2, 2, 3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  icon: {
    fontSize: 75,
    color: blueGrey[300]
  },
  welcome: {
    fontSize: 28,
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
  submit: {
    marginBottom: theme.spacing(3)
  }
}))
