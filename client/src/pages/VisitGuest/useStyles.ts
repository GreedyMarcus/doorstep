import { makeStyles } from '@material-ui/core/styles'

/**
 * Custom React hook that spearates the Visit guest page styling.
 */
export default makeStyles(theme => ({
  title: {
    fontSize: 26,
    fontWeight: 500,
    padding: theme.spacing(3, 3, 0)
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginTop: theme.spacing(1)
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    paddingBottom: theme.spacing(0.5)
  },
  label: {
    fontSize: 15,
    fontWeight: 600
  },
  text: {
    fontSize: 16,
    fontWeight: 500,
    marginTop: theme.spacing(0.125)
  },
  grid: {
    padding: theme.spacing(1, 3, 0)
  },
  list: {
    padding: theme.spacing(1, 2)
  },
  buttons: {
    padding: theme.spacing(1, 4, 3)
  },
  close: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: `${theme.spacing(0.5, 1, 0)} !important` as string // Workaround to use !important
  },
  closeIcon: {
    fontSize: 30,
    margin: theme.spacing(0.5, 0.75)
  }
}))
