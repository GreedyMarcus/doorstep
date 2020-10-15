import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  title: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    alignSelf: 'flex-start'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    alignSelf: 'flex-start'
  },
  item: {
    fontWeight: 600
  }
}))
