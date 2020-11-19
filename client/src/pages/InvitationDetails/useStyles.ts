import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
    padding: theme.spacing(3, 3, 0)
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
    padding: theme.spacing(1, 2)
  }
}))
