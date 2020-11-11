import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  tableContainer: {
    padding: theme.spacing(0, 1)
  },
  tableHeaderCell: {
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'left'
  },
  tableBodyCell: {
    fontSize: 16,
    textAlign: 'left'
  },
  tableEmptyCell: {
    width: theme.spacing(5)
  }
}))
