import blueGrey from '@material-ui/core/colors/blueGrey'
import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4)
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
    padding: theme.spacing(3, 3, 2)
  },
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
  },
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
    fontSize: 20,
    fontWeight: 500,
    marginBottom: theme.spacing(2)
  }
}))
