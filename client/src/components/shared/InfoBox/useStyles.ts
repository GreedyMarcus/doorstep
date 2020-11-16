import blueGrey from '@material-ui/core/colors/blueGrey'
import { makeStyles } from '@material-ui/core/styles'

type Props = {
  iconType: 'error' | 'info'
}

export default makeStyles(theme => ({
  container: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  icon: ({ iconType }: Props) => ({
    fontSize: 60,
    color: iconType === 'error' ? theme.palette.error.main : blueGrey[400],
    marginBottom: theme.spacing(3)
  }),
  text: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  }
}))
