import { makeStyles } from '@material-ui/core/styles'

/**
 * Custom React hook that spearates the Responsible table head component styling.
 */
export default makeStyles(theme => ({
  tableCell: {
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'left'
  },
  emptyCell: {
    width: theme.spacing(5)
  }
}))
