import blueGrey from '@material-ui/core/colors/blueGrey'
import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  infoContainer: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  infoIcon: {
    fontSize: 60,
    color: blueGrey[400],
    marginBottom: theme.spacing(3)
  },
  infoText: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  }
}))
