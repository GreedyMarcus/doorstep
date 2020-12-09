import { makeStyles } from '@material-ui/core/styles'

/**
 * Custom React hook that spearates the Visits page styling.
 */
export default makeStyles(theme => ({
  tableContainer: {
    padding: theme.spacing(0, 1)
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
