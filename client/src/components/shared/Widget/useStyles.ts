import blueGrey from '@material-ui/core/colors/blueGrey'
import { makeStyles } from '@material-ui/core/styles'

/**
 * Custom React hook that spearates the Widget component styling.
 */
export default makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
    padding: theme.spacing(3, 3, 2)
  },
  info: {
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
