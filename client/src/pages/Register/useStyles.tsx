import blueGrey from '@material-ui/core/colors/blueGrey'
import { makeStyles } from '@material-ui/core/styles'

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
    color: blueGrey[300]
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    marginTop: theme.spacing(1)
  },
  stepper: {
    padding: theme.spacing(3, 1, 3)
  },
  form: {
    width: '100%'
  },
  buttons: {
    margin: theme.spacing(3, 0)
  },
  button: {
    marginLeft: theme.spacing(1)
  }
}))
