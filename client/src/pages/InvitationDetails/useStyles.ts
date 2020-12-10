import { makeStyles } from '@material-ui/core/styles'

/**
 * Custom React hook that spearates the Invitation details page styling.
 */
export default makeStyles(theme => ({
  tableContainer: {
    padding: theme.spacing(0, 1)
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginTop: theme.spacing(2)
  },
  label: {
    fontSize: 15,
    fontWeight: 600
  },
  text: {
    fontSize: 16,
    fontWeight: 500,
    marginTop: theme.spacing(0.5)
  },
  grid: {
    padding: theme.spacing(1, 3, 3)
  },
  tableCell: {
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'left'
  },
  emptyCell: {
    width: theme.spacing(5)
  },
  listSectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    padding: theme.spacing(4, 3, 1)
  },
  list: {
    padding: theme.spacing(1, 2, 3)
  }
}))
