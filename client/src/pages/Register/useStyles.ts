import blueGrey from '@material-ui/core/colors/blueGrey'
import { makeStyles } from '@material-ui/core/styles'

/**
 * Custom React hook that spearates the Register page styling.
 */
export default makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
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
  title: {
    fontSize: 24,
    fontWeight: 600,
    marginTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    alignSelf: 'flex-start'
  },
  stepper: {
    padding: theme.spacing(3, 1, 3)
  },
  form: {
    width: '100%' // Fix IE 11 issue.
  },
  buttons: {
    margin: theme.spacing(3, 0, 2)
  },
  button: {
    marginLeft: theme.spacing(1)
  },
  item: {
    fontSize: 14
  },
  bold: {
    fontWeight: 600
  }
}))
