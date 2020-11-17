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
    marginTop: theme.spacing(1)
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 600
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
    padding: theme.spacing(1, 3, 0)
  },
  select: {
    width: '100%',
    '& > div.MuiSelect-outlined': {
      padding: theme.spacing(1.25)
    }
  },
  list: {
    padding: theme.spacing(1, 2, 1, 1)
  },
  checkbox: {
    paddingTop: theme.spacing(1)
  },
  buttons: {
    padding: theme.spacing(0, 4, 3)
  },
  button: {
    marginLeft: theme.spacing(2)
  }
}))
