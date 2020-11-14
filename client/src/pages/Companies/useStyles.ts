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
  tableCell: {
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'left'
  },
  emptyCell: {
    width: theme.spacing(5)
  }
}))
