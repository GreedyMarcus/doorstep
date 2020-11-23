import blueGrey from '@material-ui/core/colors/blueGrey'
import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
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
