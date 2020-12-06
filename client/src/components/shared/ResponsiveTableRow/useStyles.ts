import { makeStyles } from '@material-ui/core/styles'

/**
 * Custom React hook that spearates the Responsive table row component styling.
 */
export default makeStyles(() => ({
  tableRow: {
    '& > *': {
      borderBottom: 'unset'
    }
  },
  tableCell: {
    fontSize: 16,
    textAlign: 'left'
  }
}))
