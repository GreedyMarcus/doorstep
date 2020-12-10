import { makeStyles } from '@material-ui/core/styles'

/**
 * Custom React hook that spearates the Visits details page styling.
 */
export default makeStyles(theme => ({
  grid: {
    padding: theme.spacing(1, 3, 3)
  },
  firstSectionTitle: {
    fontSize: 20,
    fontWeight: 600
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
  tableContainer: {
    padding: theme.spacing(0, 1)
  },
  tableRowGrid: {
    padding: theme.spacing(1, 3, 2)
  },
  tableRowContentTitle: {
    fontSize: 20,
    fontWeight: 600
  },
  tableRowSectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(1.5)
  },
  tableRowItem: {
    fontSize: 14,
    marginBottom: theme.spacing(0.5)
  },
  bold: {
    fontWeight: 600
  },
  listSectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    padding: theme.spacing(4, 3, 1)
  },
  list: {
    padding: theme.spacing(1, 2)
  }
}))
