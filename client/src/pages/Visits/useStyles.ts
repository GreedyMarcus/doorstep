import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
    padding: theme.spacing(3, 3, 2)
  },
  settings: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: `${theme.spacing(0.5, 1, 0)} !important` as string // Workaround to use !important
  },
  settingsIcon: {
    fontSize: 30,
    margin: theme.spacing(0.5, 0.75)
  }
}))
