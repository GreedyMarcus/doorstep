import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  homeIcon: {
    marginRight: theme.spacing(0.5)
  },
  homeTitle: {
    paddingTop: theme.spacing(0.25),
    marginRight: theme.spacing(1.5)
  },
  grow: {
    flexGrow: 1
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  }
}))
