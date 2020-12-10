import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  title: {
    background: theme.palette.primary.main,
    color: theme.palette.background.paper
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: theme.spacing(1.5),
    paddingTop: theme.spacing(2.5)
  },
  guestSectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
    paddingTop: theme.spacing(2.5)
  },
  content: {
    padding: theme.spacing(0, 3, 3)
  },
  select: {
    width: '100%',
    '& > div.MuiSelect-outlined': {
      padding: theme.spacing(1.25)
    }
  },
  label: {
    paddingBottom: theme.spacing(0.5)
  },
  list: {
    overflow: 'auto',
    maxHeight: 140
  },
  listItem: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0)
  },
  button: {
    marginRight: theme.spacing(1.5)
  }
}))
