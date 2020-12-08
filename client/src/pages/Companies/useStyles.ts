import { makeStyles } from '@material-ui/core/styles'

/**
 * Custom React hook that spearates the Companies page styling.
 */
export default makeStyles(theme => ({
  tableContainer: {
    padding: theme.spacing(0, 1)
  },
  tableRowGrid: {
    padding: theme.spacing(1, 3, 2)
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 600
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(1.5)
  },
  item: {
    fontSize: 14,
    marginBottom: theme.spacing(0.5)
  },
  bold: {
    fontWeight: 600
  }
}))
