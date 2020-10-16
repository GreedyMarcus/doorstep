import { makeStyles } from '@material-ui/core/styles'

type Props = { visible: boolean }

export default makeStyles(theme => ({
  wrapper: (props: Props) => ({
    display: props.visible ? 'block' : 'none'
  }),
  title: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    alignSelf: 'flex-start'
  }
}))
